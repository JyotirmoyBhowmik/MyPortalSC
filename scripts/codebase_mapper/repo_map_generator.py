"""
Aider-style compact repository map generator.
Outputs token-efficient REPO_MAP.md with line numbers and elided bodies.
"""

from collections import defaultdict
from pathlib import Path
from typing import Dict, List

from .config import MapperConfig
from .crawler import FileEntry, RepoCrawler
from .parser import CodeSymbol, CodebaseParser, ParsedFile


class RepoMapGenerator:
    def __init__(self, config: MapperConfig):
        self.config = config
        self.crawler = RepoCrawler(config.root_dir)
        self.parser = CodebaseParser()

    def generate(self) -> str:
        files: List[FileEntry] = sorted(list(self.crawler.crawl()), key=lambda f: f.rel_path)
        total_loc = sum(f.line_count for f in files)

        parsed_files: List[tuple[FileEntry, ParsedFile]] = []
        total_symbols = 0

        for entry in files:
            parsed = self.parser.parse_file(entry.rel_path, entry.abs_path, entry.extension)
            parsed_files.append((entry, parsed))
            total_symbols += len(parsed.symbols)

        # Group files by top-level section
        sections: Dict[str, List[tuple[FileEntry, ParsedFile]]] = defaultdict(list)
        for entry, parsed in parsed_files:
            p = entry.rel_path
            if p.startswith("src/app/api/"):
                sections["API Routes (src/app/api)"].append((entry, parsed))
            elif p.startswith("src/app/admin/"):
                sections["Admin Portal (src/app/admin)"].append((entry, parsed))
            elif p.startswith("src/app/"):
                sections["App Pages & Layouts (src/app)"].append((entry, parsed))
            elif p.startswith("src/components/"):
                sections["UI & Visual Components (src/components)"].append((entry, parsed))
            elif p.startswith("src/lib/"):
                sections["Core Libraries & Data Services (src/lib)"].append((entry, parsed))
            elif p.startswith("scripts/"):
                sections["Tooling & Automation Scripts (scripts)"].append((entry, parsed))
            elif p.startswith("supabase/"):
                sections["Database Migrations & Schema (supabase)"].append((entry, parsed))
            elif "/" not in p:
                sections["Root Configuration & Entry"].append((entry, parsed))
            else:
                sections["Other Modules"].append((entry, parsed))

        md_lines: List[str] = [
            "# Codebase Repository Map",
            "",
            "> **Aider-Style Structural Outline**: Generated with Tree-Sitter syntax analysis.",
            f"> **Summary**: {len(files)} source files | {total_loc:,} lines of code | {total_symbols:,} symbols extracted.",
            "> **Token Economy**: Function bodies and internal statements are elided to maximize AI reasoning context.",
            "",
            "---",
            "",
        ]

        # Order of sections to render
        section_order = [
            "Root Configuration & Entry",
            "Core Libraries & Data Services (src/lib)",
            "API Routes (src/app/api)",
            "UI & Visual Components (src/components)",
            "App Pages & Layouts (src/app)",
            "Admin Portal (src/app/admin)",
            "Database Migrations & Schema (supabase)",
            "Tooling & Automation Scripts (scripts)",
            "Other Modules",
        ]

        for sec_name in section_order:
            file_list = sections.get(sec_name)
            if not file_list:
                continue

            md_lines.append(f"## {sec_name}")
            md_lines.append("")

            for entry, parsed in file_list:
                md_lines.append(f"### `{entry.rel_path}` ({entry.line_count} loc)")

                if not parsed.symbols:
                    # If file has imports or exports but no parsed symbols, show summary
                    if parsed.exports:
                        exp_str = ", ".join(parsed.exports[:5])
                        md_lines.append(f"│    (Exports: {exp_str})")
                    else:
                        md_lines.append("│    (Declaration/data file with no top-level symbol definitions)")
                    md_lines.append("")
                    continue

                # Print symbols hierarchically
                current_parent = None
                for sym in parsed.symbols:
                    if sym.kind == "class":
                        current_parent = sym.name
                        md_lines.append(f"│  class {sym.name} [L{sym.line_number}]")
                    elif sym.parent_symbol:
                        md_lines.append(f"│    {sym.line_number:>4}: {sym.signature}")
                    else:
                        current_parent = None
                        md_lines.append(f"│  {sym.line_number:>4}: {sym.signature}")

                md_lines.append("")

        content = "\n".join(md_lines) + "\n"

        # Write to REPO_MAP.md
        out_file = self.config.repo_map_output
        out_file.parent.mkdir(parents=True, exist_ok=True)
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(content)

        public_map = self.config.root_dir / "public" / "REPO_MAP.md"
        try:
            with open(public_map, "w", encoding="utf-8") as f:
                f.write(content)
        except Exception:
            pass

        return content
