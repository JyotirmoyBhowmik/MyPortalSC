"""
Syntax tree & symbol parser using Tree-Sitter with multi-language AST/regex fallback.
Extracts classes, interfaces, types, function/method signatures, imports, exports, and calls.
"""

import ast
import re
import warnings
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Set

# Suppress Tree-Sitter legacy deprecation warning
warnings.filterwarnings("ignore", category=FutureWarning, module="tree_sitter")

try:
    import tree_sitter_languages as tsl
    _HAS_TREE_SITTER = True
except Exception:
    _HAS_TREE_SITTER = False


@dataclass
class CodeSymbol:
    name: str
    kind: str  # "function", "class", "interface", "type", "method", "table", "trigger"
    signature: str
    line_number: int  # 1-indexed
    parent_symbol: Optional[str] = None
    is_exported: bool = False


@dataclass
class ImportRef:
    source: str
    specifiers: List[str] = field(default_factory=list)
    is_type_only: bool = False
    line_number: int = 1


@dataclass
class ParsedFile:
    rel_path: str
    language: str
    symbols: List[CodeSymbol] = field(default_factory=list)
    imports: List[ImportRef] = field(default_factory=list)
    exports: List[str] = field(default_factory=list)
    calls: List[str] = field(default_factory=list)


class CodebaseParser:
    def __init__(self):
        self._parsers: Dict[str, object] = {}
        if _HAS_TREE_SITTER:
            self._init_tree_sitter()

    def _init_tree_sitter(self):
        for lang, ts_name in [
            ("typescript", "typescript"),
            ("tsx", "tsx"),
            ("javascript", "javascript"),
            ("python", "python"),
        ]:
            try:
                self._parsers[lang] = tsl.get_parser(ts_name)
            except Exception:
                pass

    def parse_file(self, rel_path: str, abs_path: Path, ext: str) -> ParsedFile:
        language = self._detect_language(ext)
        try:
            with open(abs_path, "rb") as f:
                content_bytes = f.read()
            content_str = content_bytes.decode("utf-8", errors="replace")
        except Exception:
            return ParsedFile(rel_path=rel_path, language=language)

        if language == "sql":
            return self._parse_sql(rel_path, content_str)

        if _HAS_TREE_SITTER and language in self._parsers:
            try:
                return self._parse_tree_sitter(rel_path, content_bytes, content_str, language)
            except Exception:
                # Fallback on any tree-sitter runtime error
                return self._parse_fallback(rel_path, content_str, language)

        return self._parse_fallback(rel_path, content_str, language)

    def _detect_language(self, ext: str) -> str:
        ext = ext.lower()
        if ext == ".tsx":
            return "tsx"
        elif ext in {".ts", ".mts"}:
            return "typescript"
        elif ext in {".jsx", ".js", ".mjs", ".cjs"}:
            return "javascript"
        elif ext == ".py":
            return "python"
        elif ext == ".sql":
            return "sql"
        return "unknown"

    def _normalize_signature(self, text: str) -> str:
        """Compress multiline signatures into a single clean line."""
        # Replace newlines and multiple spaces with a single space
        cleaned = re.sub(r"\s+", " ", text).strip()
        # Remove trailing { or ; if present
        if cleaned.endswith("{"):
            cleaned = cleaned[:-1].strip()
        return cleaned

    def _parse_tree_sitter(
        self, rel_path: str, content_bytes: bytes, content_str: str, language: str
    ) -> ParsedFile:
        parser = self._parsers[language]
        tree = parser.parse(content_bytes)
        root = tree.root_node

        symbols: List[CodeSymbol] = []
        imports: List[ImportRef] = []
        exports: Set[str] = set()
        calls: Set[str] = set()

        if language in ("typescript", "tsx", "javascript"):
            self._extract_js_ts(root, content_bytes, symbols, imports, exports, calls)
        elif language == "python":
            self._extract_python(root, content_bytes, symbols, imports, exports, calls)

        return ParsedFile(
            rel_path=rel_path,
            language=language,
            symbols=symbols,
            imports=imports,
            exports=sorted(list(exports)),
            calls=sorted(list(calls)),
        )

    # -------------------------------------------------------------
    # TypeScript / JavaScript Tree-Sitter Extractor
    # -------------------------------------------------------------
    def _extract_js_ts(
        self,
        node,
        code: bytes,
        symbols: List[CodeSymbol],
        imports: List[ImportRef],
        exports: Set[str],
        calls: Set[str],
    ):
        def get_text(n) -> str:
            return code[n.start_byte : n.end_byte].decode("utf-8", errors="replace")

        def walk(n, parent_class: Optional[str] = None, is_exported_ctx: bool = False):
            nt = n.type

            # Import statement
            if nt == "import_statement":
                source = ""
                specifiers = []
                is_type = False
                text = get_text(n)
                if "import type" in text:
                    is_type = True

                for child in n.children:
                    if child.type == "string":
                        source = get_text(child).strip("'\"`")
                    elif child.type == "import_clause":
                        clause_text = get_text(child)
                        for part in re.findall(r"[\w$]+", clause_text):
                            if part not in {"type", "from", "import", "as"}:
                                specifiers.append(part)

                if source:
                    imports.append(
                        ImportRef(
                            source=source,
                            specifiers=specifiers,
                            is_type_only=is_type,
                            line_number=n.start_point[0] + 1,
                        )
                    )
                return

            # Export statement wrapper
            if nt == "export_statement":
                # Check for re-export with source
                source = None
                for child in n.children:
                    if child.type == "string":
                        source = get_text(child).strip("'\"`")
                if source:
                    specifiers = []
                    text = get_text(n)
                    for part in re.findall(r"[\w$]+", text):
                        if part not in {"export", "type", "from", "as", "default", "*"}:
                            specifiers.append(part)
                    imports.append(
                        ImportRef(
                            source=source,
                            specifiers=specifiers,
                            is_type_only="type" in text,
                            line_number=n.start_point[0] + 1,
                        )
                    )

                for child in n.children:
                    walk(child, parent_class=parent_class, is_exported_ctx=True)
                return

            # Function declaration
            if nt in ("function_declaration", "generator_function_declaration"):
                name = ""
                sig_parts = []
                is_async = False
                for child in n.children:
                    if child.type == "async":
                        is_async = True
                    elif child.type == "identifier":
                        name = get_text(child)
                        exports.add(name) if is_exported_ctx else None
                    elif child.type in ("formal_parameters", "type_annotation"):
                        sig_parts.append(get_text(child))
                    elif child.type == "statement_block":
                        break

                if name:
                    prefix = "export " if is_exported_ctx else ""
                    async_prefix = "async " if is_async else ""
                    sig_text = f"{prefix}{async_prefix}function {name}{''.join(sig_parts)}"
                    symbols.append(
                        CodeSymbol(
                            name=name,
                            kind="function",
                            signature=self._normalize_signature(sig_text),
                            line_number=n.start_point[0] + 1,
                            is_exported=is_exported_ctx,
                        )
                    )
                return

            # Class declaration
            if nt == "class_declaration":
                class_name = ""
                heritage = ""
                for child in n.children:
                    if child.type == "type_identifier":
                        class_name = get_text(child)
                        if is_exported_ctx:
                            exports.add(class_name)
                    elif child.type == "class_heritage":
                        heritage = " " + get_text(child)
                    elif child.type == "class_body":
                        prefix = "export " if is_exported_ctx else ""
                        sig = f"{prefix}class {class_name}{heritage}".strip()
                        symbols.append(
                            CodeSymbol(
                                name=class_name,
                                kind="class",
                                signature=self._normalize_signature(sig),
                                line_number=n.start_point[0] + 1,
                                is_exported=is_exported_ctx,
                            )
                        )
                        for body_child in child.children:
                            walk(body_child, parent_class=class_name, is_exported_ctx=is_exported_ctx)
                return

            # Interface declaration
            if nt == "interface_declaration":
                iface_name = ""
                heritage = ""
                for child in n.children:
                    if child.type == "type_identifier":
                        iface_name = get_text(child)
                        if is_exported_ctx:
                            exports.add(iface_name)
                    elif child.type == "extends_type_clause":
                        heritage = " " + get_text(child)

                if iface_name:
                    prefix = "export " if is_exported_ctx else ""
                    symbols.append(
                        CodeSymbol(
                            name=iface_name,
                            kind="interface",
                            signature=self._normalize_signature(f"{prefix}interface {iface_name}{heritage}"),
                            line_number=n.start_point[0] + 1,
                            is_exported=is_exported_ctx,
                        )
                    )
                return

            # Type alias declaration
            if nt == "type_alias_declaration":
                type_name = ""
                for child in n.children:
                    if child.type == "type_identifier":
                        type_name = get_text(child)
                        if is_exported_ctx:
                            exports.add(type_name)

                if type_name:
                    prefix = "export " if is_exported_ctx else ""
                    symbols.append(
                        CodeSymbol(
                            name=type_name,
                            kind="type",
                            signature=f"{prefix}type {type_name} = ...",
                            line_number=n.start_point[0] + 1,
                            is_exported=is_exported_ctx,
                        )
                    )
                return

            # Method definition inside class
            if nt == "method_definition":
                name = ""
                sig_parts = []
                for child in n.children:
                    if child.type in ("property_identifier", "identifier"):
                        name = get_text(child)
                    elif child.type in ("formal_parameters", "type_annotation"):
                        sig_parts.append(get_text(child))
                    elif child.type == "statement_block":
                        break
                if name:
                    sig = f"{name}{''.join(sig_parts)}"
                    symbols.append(
                        CodeSymbol(
                            name=name,
                            kind="method",
                            signature=self._normalize_signature(sig),
                            line_number=n.start_point[0] + 1,
                            parent_symbol=parent_class,
                            is_exported=is_exported_ctx,
                        )
                    )
                return

            # Variable / arrow function declaration
            if nt in ("lexical_declaration", "variable_declaration"):
                for declarator in n.children:
                    if declarator.type == "variable_declarator":
                        var_name = ""
                        is_fn = False
                        fn_sig = ""
                        for c in declarator.children:
                            if c.type == "identifier":
                                var_name = get_text(c)
                            elif c.type == "arrow_function":
                                is_fn = True
                                params = ""
                                ret = ""
                                for fc in c.children:
                                    if fc.type == "formal_parameters":
                                        params = get_text(fc)
                                    elif fc.type == "type_annotation":
                                        ret = get_text(fc)
                                fn_sig = f"({params}){ret} => ..."
                        if is_fn and var_name:
                            prefix = "export " if is_exported_ctx else ""
                            symbols.append(
                                CodeSymbol(
                                    name=var_name,
                                    kind="function",
                                    signature=self._normalize_signature(f"{prefix}const {var_name} = {fn_sig}"),
                                    line_number=n.start_point[0] + 1,
                                    is_exported=is_exported_ctx,
                                )
                            )
                            if is_exported_ctx:
                                exports.add(var_name)
                return

            # Call expressions
            if nt == "call_expression":
                fn_node = n.child_by_field_name("function")
                if fn_node:
                    fn_name = get_text(fn_node)
                    if re.match(r"^[\w$]+$", fn_name):
                        calls.add(fn_name)
                    elif "." in fn_name:
                        # Extract method name
                        parts = fn_name.split(".")
                        if re.match(r"^[\w$]+$", parts[-1]):
                            calls.add(parts[-1])

            # Recurse through children
            for child in n.children:
                walk(child, parent_class=parent_class, is_exported_ctx=is_exported_ctx)

        walk(node)

    # -------------------------------------------------------------
    # Python Tree-Sitter Extractor
    # -------------------------------------------------------------
    def _extract_python(
        self,
        node,
        code: bytes,
        symbols: List[CodeSymbol],
        imports: List[ImportRef],
        exports: Set[str],
        calls: Set[str],
    ):
        def get_text(n) -> str:
            return code[n.start_byte : n.end_byte].decode("utf-8", errors="replace")

        def walk(n, parent_class: Optional[str] = None):
            nt = n.type

            if nt == "import_statement":
                text = get_text(n).strip()
                # import a, b as c
                for mod in re.findall(r"import\s+([\w\.,\s]+)", text):
                    for m in mod.split(","):
                        clean_m = m.strip().split()[0]
                        if clean_m:
                            imports.append(
                                ImportRef(
                                    source=clean_m,
                                    specifiers=[clean_m],
                                    line_number=n.start_point[0] + 1,
                                )
                            )
                return

            if nt == "import_from_statement":
                text = get_text(n).strip()
                match = re.search(r"from\s+([\w\.]+)\s+import\s+(.+)", text)
                if match:
                    source = match.group(1)
                    specs = [s.strip().split()[0] for s in match.group(2).split(",") if s.strip()]
                    imports.append(
                        ImportRef(
                            source=source,
                            specifiers=specs,
                            line_number=n.start_point[0] + 1,
                        )
                    )
                return

            if nt in ("function_definition", "async_function_definition"):
                name = ""
                params = ""
                ret = ""
                is_async = nt.startswith("async")
                for child in n.children:
                    if child.type == "identifier":
                        name = get_text(child)
                    elif child.type == "parameters":
                        params = get_text(child)
                    elif child.type == "type":
                        ret = f" -> {get_text(child)}"
                    elif child.type == "block":
                        break

                if name:
                    async_prefix = "async " if is_async else ""
                    kind = "method" if parent_class else "function"
                    sig = f"{async_prefix}def {name}{params}{ret}: ..."
                    symbols.append(
                        CodeSymbol(
                            name=name,
                            kind=kind,
                            signature=self._normalize_signature(sig),
                            line_number=n.start_point[0] + 1,
                            parent_symbol=parent_class,
                            is_exported=not name.startswith("_"),
                        )
                    )
                    exports.add(name)
                return

            if nt == "class_definition":
                class_name = ""
                arg_list = ""
                for child in n.children:
                    if child.type == "identifier":
                        class_name = get_text(child)
                    elif child.type == "argument_list":
                        arg_list = get_text(child)
                    elif child.type == "block":
                        symbols.append(
                            CodeSymbol(
                                name=class_name,
                                kind="class",
                                signature=f"class {class_name}{arg_list}: ...",
                                line_number=n.start_point[0] + 1,
                                is_exported=not class_name.startswith("_"),
                            )
                        )
                        exports.add(class_name)
                        for body_child in child.children:
                            walk(body_child, parent_class=class_name)
                return

            if nt == "call":
                fn_node = n.child_by_field_name("function")
                if fn_node:
                    fn_name = get_text(fn_node)
                    if "." in fn_name:
                        fn_name = fn_name.split(".")[-1]
                    if re.match(r"^[\w_]+$", fn_name):
                        calls.add(fn_name)

            for child in n.children:
                walk(child, parent_class=parent_class)

        walk(node)

    # -------------------------------------------------------------
    # SQL Schema Extractor
    # -------------------------------------------------------------
    def _parse_sql(self, rel_path: str, content: str) -> ParsedFile:
        symbols: List[CodeSymbol] = []
        lines = content.splitlines()

        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            # CREATE TABLE
            table_match = re.search(r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([\"'\w\.]+)", stripped, re.IGNORECASE)
            if table_match:
                tbl = table_match.group(1).replace('"', '')
                symbols.append(
                    CodeSymbol(
                        name=tbl,
                        kind="table",
                        signature=f"CREATE TABLE {tbl}",
                        line_number=idx,
                        is_exported=True,
                    )
                )
            # CREATE FUNCTION
            fn_match = re.search(r"CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+([\"'\w\.]+)\s*\((.*?)\)", stripped, re.IGNORECASE)
            if fn_match:
                fn_name = fn_match.group(1).replace('"', '')
                params = fn_match.group(2)
                symbols.append(
                    CodeSymbol(
                        name=fn_name,
                        kind="function",
                        signature=f"CREATE FUNCTION {fn_name}({params})",
                        line_number=idx,
                        is_exported=True,
                    )
                )
            # CREATE TRIGGER
            trig_match = re.search(r"CREATE\s+(?:OR\s+REPLACE\s+)?TRIGGER\s+([\"'\w\.]+)", stripped, re.IGNORECASE)
            if trig_match:
                trig = trig_match.group(1).replace('"', '')
                symbols.append(
                    CodeSymbol(
                        name=trig,
                        kind="trigger",
                        signature=f"CREATE TRIGGER {trig}",
                        line_number=idx,
                    )
                )

        return ParsedFile(rel_path=rel_path, language="sql", symbols=symbols)

    # -------------------------------------------------------------
    # Fallback Parser (Regex & Standard Python AST)
    # -------------------------------------------------------------
    def _parse_fallback(self, rel_path: str, content: str, language: str) -> ParsedFile:
        symbols: List[CodeSymbol] = []
        imports: List[ImportRef] = []
        exports: Set[str] = set()
        calls: Set[str] = set()

        if language == "python":
            try:
                tree = ast.parse(content)
                for node in ast.walk(tree):
                    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        symbols.append(
                            CodeSymbol(
                                name=node.name,
                                kind="function",
                                signature=f"def {node.name}(...): ...",
                                line_number=node.lineno,
                                is_exported=not node.name.startswith("_"),
                            )
                        )
                        exports.add(node.name)
                    elif isinstance(node, ast.ClassDef):
                        symbols.append(
                            CodeSymbol(
                                name=node.name,
                                kind="class",
                                signature=f"class {node.name}: ...",
                                line_number=node.lineno,
                                is_exported=not node.name.startswith("_"),
                            )
                        )
                        exports.add(node.name)
                    elif isinstance(node, ast.Import):
                        for alias in node.names:
                            imports.append(ImportRef(source=alias.name, specifiers=[alias.name], line_number=node.lineno))
                    elif isinstance(node, ast.ImportFrom) and node.module:
                        specs = [alias.name for alias in node.names]
                        imports.append(ImportRef(source=node.module, specifiers=specs, line_number=node.lineno))
                    elif isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
                        calls.add(node.func.id)
                return ParsedFile(
                    rel_path=rel_path,
                    language=language,
                    symbols=symbols,
                    imports=imports,
                    exports=sorted(list(exports)),
                    calls=sorted(list(calls)),
                )
            except Exception:
                pass

        # Regex fallback for JS/TS
        lines = content.splitlines()
        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            # Imports
            imp_match = re.search(r"import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['\"]([^'\"]+)['\"]", stripped)
            if imp_match:
                specs = []
                if imp_match.group(1):
                    specs.extend([s.strip().split()[0] for s in imp_match.group(1).split(",") if s.strip()])
                elif imp_match.group(2):
                    specs.append(imp_match.group(2))
                elif imp_match.group(3):
                    specs.append(imp_match.group(3))
                imports.append(
                    ImportRef(
                        source=imp_match.group(4),
                        specifiers=specs,
                        line_number=idx,
                    )
                )

            # Export function
            fn_match = re.search(r"(export\s+)?(async\s+)?function\s+(\w+)\s*\((.*?)\)", stripped)
            if fn_match:
                name = fn_match.group(3)
                is_exp = bool(fn_match.group(1))
                symbols.append(
                    CodeSymbol(
                        name=name,
                        kind="function",
                        signature=f"{'export ' if is_exp else ''}function {name}(...)",
                        line_number=idx,
                        is_exported=is_exp,
                    )
                )
                if is_exp:
                    exports.add(name)

            # Classes
            cls_match = re.search(r"(export\s+)?class\s+(\w+)", stripped)
            if cls_match:
                name = cls_match.group(2)
                is_exp = bool(cls_match.group(1))
                symbols.append(
                    CodeSymbol(
                        name=name,
                        kind="class",
                        signature=f"{'export ' if is_exp else ''}class {name}",
                        line_number=idx,
                        is_exported=is_exp,
                    )
                )
                if is_exp:
                    exports.add(name)

            # Interfaces
            iface_match = re.search(r"(export\s+)?interface\s+(\w+)", stripped)
            if iface_match:
                name = iface_match.group(2)
                is_exp = bool(iface_match.group(1))
                symbols.append(
                    CodeSymbol(
                        name=name,
                        kind="interface",
                        signature=f"{'export ' if is_exp else ''}interface {name}",
                        line_number=idx,
                        is_exported=is_exp,
                    )
                )
                if is_exp:
                    exports.add(name)

        return ParsedFile(
            rel_path=rel_path,
            language=language,
            symbols=symbols,
            imports=imports,
            exports=sorted(list(exports)),
            calls=sorted(list(calls)),
        )
