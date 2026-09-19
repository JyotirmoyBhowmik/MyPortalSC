"""
Configuration constants and settings for the codebase mapping utility.
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Set

# File extensions recognized for AST parsing and code mapping
SUPPORTED_EXTENSIONS: Set[str] = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".py",
    ".sql",
}

# Directories and files always ignored regardless of .gitignore
DEFAULT_IGNORES: Set[str] = {
    ".git",
    ".next",
    "node_modules",
    ".vscode",
    ".idea",
    "dist",
    "build",
    "out",
    "coverage",
    ".gemini",
    "__pycache__",
    ".turbo",
    ".vercel",
    "*.tsbuildinfo",
    "*.log",
    "*.docx",
    "*.pdf",
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.svg",
    "*.ico",
    "*.woff",
    "*.woff2",
    "*.ttf",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
}

# Max file size to parse (to prevent memory bloat on large bundled/generated files)
MAX_FILE_SIZE_BYTES: int = 512 * 1024  # 512 KB

# Directory classification mapping for visual cluster coloring
GROUP_COLORS: Dict[str, str] = {
    "src/app/api": "#f43f5e",      # Rose (API endpoints)
    "src/app/admin": "#ec4899",    # Pink (Admin dashboard)
    "src/app": "#8b5cf6",          # Violet (App routes)
    "src/components": "#3b82f6",   # Blue (UI components)
    "src/lib": "#06b6d4",          # Cyan (Core utilities/services)
    "scripts": "#10b981",          # Emerald (Scripts & Tooling)
    "supabase": "#f59e0b",        # Amber (Database migrations/types)
    "external": "#64748b",         # Slate (Third-party packages)
    "root": "#a855f7",             # Purple (Root configs/entry)
    "other": "#94a3b8",            # Gray (Other files)
}


@dataclass
class MapperConfig:
    root_dir: Path
    repo_map_output: Path = field(default_factory=lambda: Path("REPO_MAP.md"))
    graph_output: Path = field(default_factory=lambda: Path("graph.json"))
    visualizer_dir: Path = field(default_factory=lambda: Path("visualizer"))
    include_external_nodes: bool = True
    max_tokens_budget: int = 100_000
    verbose: bool = False

    def __post_init__(self):
        self.root_dir = Path(self.root_dir).resolve()
        if not self.repo_map_output.is_absolute():
            self.repo_map_output = (self.root_dir / self.repo_map_output).resolve()
        if not self.graph_output.is_absolute():
            self.graph_output = (self.root_dir / self.graph_output).resolve()
        if not self.visualizer_dir.is_absolute():
            self.visualizer_dir = (self.root_dir / self.visualizer_dir).resolve()
