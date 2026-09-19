"""
Module and path resolver.
Resolves TypeScript path aliases (@/*), relative imports, and external packages.
"""

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Set


@dataclass
class ResolvedTarget:
    target_id: str          # Rel path if internal, package name if external
    is_external: bool
    display_name: str


class PathResolver:
    def __init__(self, root_dir: Path, known_files: Optional[Set[str]] = None):
        self.root_dir = Path(root_dir).resolve()
        self.known_files: Set[str] = known_files or set()
        self.aliases: Dict[str, str] = self._load_tsconfig_aliases()

    def _load_tsconfig_aliases(self) -> Dict[str, str]:
        aliases = {"@/*": "src/*"}  # Default fallback
        tsconfig_path = self.root_dir / "tsconfig.json"
        if tsconfig_path.exists():
            try:
                with open(tsconfig_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    paths = data.get("compilerOptions", {}).get("paths", {})
                    for alias_key, alias_targets in paths.items():
                        if alias_targets and isinstance(alias_targets, list):
                            # Normalize e.g. "./src/*" -> "src/*"
                            target = alias_targets[0].lstrip("./").rstrip("/")
                            aliases[alias_key] = target
            except Exception:
                pass
        return aliases

    def resolve(self, current_file_rel: str, import_source: str) -> ResolvedTarget:
        """
        Resolves import_source from the context of current_file_rel into a target node ID.
        """
        import_source = import_source.strip()
        if not import_source:
            return ResolvedTarget(target_id="", is_external=True, display_name="")

        # 1. Check path aliases (e.g. @/*)
        for alias_pat, target_prefix in self.aliases.items():
            if alias_pat.endswith("/*") and import_source.startswith(alias_pat[:-2] + "/"):
                suffix = import_source[len(alias_pat[:-2]) + 1 :]
                clean_target_prefix = target_prefix.rstrip("/*")
                candidate_base = f"{clean_target_prefix}/{suffix}"
                resolved = self._match_extension(candidate_base)
                if resolved:
                    return ResolvedTarget(target_id=resolved, is_external=False, display_name=resolved)
                return ResolvedTarget(target_id=candidate_base, is_external=False, display_name=candidate_base)

        # 2. Check relative imports (./ or ../)
        if import_source.startswith("./") or import_source.startswith("../"):
            current_dir = Path(current_file_rel).parent
            raw_path = (current_dir / import_source).as_posix()
            import os
            normalized = os.path.normpath(raw_path).replace("\\", "/")
            resolved = self._match_extension(normalized)
            if resolved:
                return ResolvedTarget(target_id=resolved, is_external=False, display_name=resolved)
            return ResolvedTarget(target_id=normalized, is_external=False, display_name=normalized)

        # 3. External npm / pip package
        pkg_name = import_source
        if pkg_name.startswith("@"):
            parts = pkg_name.split("/")
            pkg_name = "/".join(parts[:2]) if len(parts) >= 2 else pkg_name
        else:
            pkg_name = pkg_name.split("/")[0]

        return ResolvedTarget(
            target_id=f"npm:{pkg_name}",
            is_external=True,
            display_name=pkg_name,
        )

    def _match_extension(self, base_rel: str) -> Optional[str]:
        """Try exact match or common extensions (.ts, .tsx, .js, /index.ts, etc.)"""
        candidates = [
            base_rel,
            f"{base_rel}.ts",
            f"{base_rel}.tsx",
            f"{base_rel}.js",
            f"{base_rel}.jsx",
            f"{base_rel}.mjs",
            f"{base_rel}/index.ts",
            f"{base_rel}/index.tsx",
            f"{base_rel}/index.js",
        ]
        for c in candidates:
            # Check against known crawler files if populated
            if self.known_files and c in self.known_files:
                return c
            # Check filesystem directly
            abs_candidate = self.root_dir / c
            if abs_candidate.exists() and abs_candidate.is_file():
                return c
        return None
