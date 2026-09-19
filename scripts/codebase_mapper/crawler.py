"""
Filesystem crawler respecting .gitignore and default exclusion patterns.
"""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator, List, Optional
import pathspec

from .config import DEFAULT_IGNORES, MAX_FILE_SIZE_BYTES, SUPPORTED_EXTENSIONS


@dataclass
class FileEntry:
    rel_path: str  # POSIX format, e.g. "src/lib/utils.ts"
    abs_path: Path
    extension: str
    size_bytes: int
    line_count: int


class RepoCrawler:
    def __init__(self, root_dir: Path, custom_ignores: Optional[List[str]] = None):
        self.root_dir = Path(root_dir).resolve()
        self.spec = self._build_pathspec(custom_ignores or [])

    def _build_pathspec(self, custom_ignores: List[str]) -> pathspec.PathSpec:
        patterns: List[str] = list(DEFAULT_IGNORES) + custom_ignores
        
        # Load root .gitignore if present
        gitignore_path = self.root_dir / ".gitignore"
        if gitignore_path.exists() and gitignore_path.is_file():
            try:
                with open(gitignore_path, "r", encoding="utf-8", errors="ignore") as f:
                    patterns.extend(f.readlines())
            except Exception as e:
                # Log non-fatal error reading .gitignore
                pass

        return pathspec.PathSpec.from_lines("gitignore", patterns)

    def is_ignored(self, rel_path: str) -> bool:
        # Check standard pathspec matching
        parts = rel_path.split("/")
        # Fast bail-out for known ignored directories
        for part in parts:
            if part in {".git", ".next", "node_modules", ".vscode", "dist", "build", "coverage", ".gemini"}:
                return True
        return self.spec.match_file(rel_path)

    def count_lines(self, abs_path: Path) -> int:
        try:
            with open(abs_path, "rb") as f:
                return sum(1 for _ in f)
        except Exception:
            return 0

    def crawl(self) -> Iterator[FileEntry]:
        """
        Recursively yields valid source files within root_dir.
        """
        for root, dirs, files in os.walk(self.root_dir):
            rel_dir = os.path.relpath(root, self.root_dir).replace("\\", "/")
            if rel_dir == ".":
                rel_dir = ""

            # Filter out ignored subdirectories in-place to prune walk
            pruned_dirs = []
            for d in dirs:
                sub_rel = f"{rel_dir}/{d}" if rel_dir else d
                if not self.is_ignored(sub_rel) and not self.is_ignored(f"{sub_rel}/"):
                    pruned_dirs.append(d)
            dirs[:] = pruned_dirs

            for file in sorted(files):
                sub_rel = f"{rel_dir}/{file}" if rel_dir else file
                if self.is_ignored(sub_rel):
                    continue

                abs_path = Path(root) / file
                ext = abs_path.suffix.lower()
                if ext not in SUPPORTED_EXTENSIONS:
                    continue

                try:
                    size = abs_path.stat().st_size
                except OSError:
                    continue

                if size > MAX_FILE_SIZE_BYTES or size == 0:
                    continue

                line_count = self.count_lines(abs_path)
                yield FileEntry(
                    rel_path=sub_rel,
                    abs_path=abs_path,
                    extension=ext,
                    size_bytes=size,
                    line_count=line_count,
                )
