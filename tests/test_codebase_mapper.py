"""
Comprehensive test suite for codebase mapping utility.
Triple-Layer Testing: Unit Tests, Integration Tests, and Edge Cases.
"""

import json
import os
import sys
import tempfile
from pathlib import Path

# Ensure repository root is on Python sys.path
REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

import pytest

from scripts.codebase_mapper.config import MapperConfig
from scripts.codebase_mapper.crawler import RepoCrawler
from scripts.codebase_mapper.graph_builder import GraphBuilder
from scripts.codebase_mapper.parser import CodebaseParser, ParsedFile
from scripts.codebase_mapper.repo_map_generator import RepoMapGenerator
from scripts.codebase_mapper.resolver import PathResolver
from scripts.codebase_mapper.visualizer_generator import VisualizerGenerator


# =====================================================================
# UNIT TESTS (Business Logic)
# =====================================================================

def test_crawler_excludes_standard_directories(tmp_path: Path):
    """Crawler must prune .git, node_modules, .next, etc."""
    (tmp_path / ".git").mkdir()
    (tmp_path / ".git" / "config.ts").write_text("export const x = 1;")

    (tmp_path / "node_modules").mkdir()
    (tmp_path / "node_modules" / "pkg.ts").write_text("export const x = 1;")

    (tmp_path / "src").mkdir()
    (tmp_path / "src" / "valid.ts").write_text("export function valid() {}")

    crawler = RepoCrawler(tmp_path)
    found_files = [f.rel_path for f in crawler.crawl()]

    assert "src/valid.ts" in found_files
    assert not any(f.startswith(".git") for f in found_files)
    assert not any(f.startswith("node_modules") for f in found_files)


def test_parser_typescript_function_signatures(tmp_path: Path):
    """Tree-Sitter / parser extracts function signatures with line numbers and elides bodies."""
    code = (
        "import { Request } from 'express';\n"
        "export async function processRequest(req: Request, id: string): Promise<boolean> {\n"
        "    const body = req.body;\n"
        "    return true;\n"
        "}\n"
    )
    test_file = tmp_path / "handler.ts"
    test_file.write_text(code, encoding="utf-8")

    parser = CodebaseParser()
    result = parser.parse_file("handler.ts", test_file, ".ts")

    assert len(result.symbols) == 1
    sym = result.symbols[0]
    assert sym.name == "processRequest"
    assert sym.kind == "function"
    assert sym.line_number == 2
    assert "export async function processRequest" in sym.signature
    assert "{" not in sym.signature  # Body elided


def test_parser_typescript_interfaces_and_types(tmp_path: Path):
    """Parser extracts interfaces and type aliases."""
    code = (
        "export interface UserProfile {\n"
        "    id: string;\n"
        "    name: string;\n"
        "}\n"
        "export type Status = 'active' | 'inactive';\n"
    )
    test_file = tmp_path / "types.ts"
    test_file.write_text(code, encoding="utf-8")

    parser = CodebaseParser()
    result = parser.parse_file("types.ts", test_file, ".ts")

    names = {s.name for s in result.symbols}
    assert "UserProfile" in names
    assert "Status" in names


def test_parser_python_signatures(tmp_path: Path):
    """Parser handles Python functions, classes, and imports."""
    code = (
        "import os\n"
        "class WorkerAgent:\n"
        "    def run_task(self, name: str) -> bool:\n"
        "        print(name)\n"
        "        return True\n"
    )
    test_file = tmp_path / "agent.py"
    test_file.write_text(code, encoding="utf-8")

    parser = CodebaseParser()
    result = parser.parse_file("agent.py", test_file, ".py")

    assert len(result.imports) == 1
    assert result.imports[0].source == "os"
    names = {s.name for s in result.symbols}
    assert "WorkerAgent" in names
    assert "run_task" in names


def test_resolver_alias_and_relative(tmp_path: Path):
    """PathResolver resolves @/* aliases and relative paths."""
    (tmp_path / "src" / "lib").mkdir(parents=True)
    (tmp_path / "src" / "lib" / "auth.ts").write_text("export const auth = {};")
    (tmp_path / "src" / "utils.ts").write_text("export const util = {};")

    tsconfig = {
        "compilerOptions": {
            "paths": {
                "@/*": ["./src/*"]
            }
        }
    }
    (tmp_path / "tsconfig.json").write_text(json.dumps(tsconfig))

    resolver = PathResolver(tmp_path)

    # Test @/ alias
    alias_res = resolver.resolve("src/index.ts", "@/lib/auth")
    assert alias_res.target_id == "src/lib/auth.ts"
    assert not alias_res.is_external

    # Test relative import
    rel_res = resolver.resolve("src/lib/auth.ts", "../utils")
    assert rel_res.target_id == "src/utils.ts"
    assert not rel_res.is_external

    # Test third-party npm package
    npm_res = resolver.resolve("src/index.ts", "next/server")
    assert npm_res.is_external
    assert npm_res.display_name == "next"


# =====================================================================
# INTEGRATION TESTS (Full System Pipeline)
# =====================================================================

def test_graph_builder_full_pipeline(tmp_path: Path):
    """GraphBuilder produces valid graph.json with nodes, links, and degrees."""
    (tmp_path / "src" / "lib").mkdir(parents=True)
    (tmp_path / "src" / "lib" / "db.ts").write_text("export function connect() {}")
    (tmp_path / "src" / "app.ts").write_text("import { connect } from './lib/db';\nexport function init() { connect(); }")

    config = MapperConfig(root_dir=tmp_path, include_external_nodes=True)
    builder = GraphBuilder(config)
    graph_data = builder.build()

    assert "metadata" in graph_data
    assert "nodes" in graph_data
    assert "edges" in graph_data
    assert "groups" in graph_data

    node_ids = {n["id"] for n in graph_data["nodes"]}
    assert "src/app.ts" in node_ids
    assert "src/lib/db.ts" in node_ids

    # Verify edge
    found_edge = any(
        e["source"] == "src/app.ts" and e["target"] == "src/lib/db.ts"
        for e in graph_data["edges"]
    )
    assert found_edge

    # Verify degree calculation
    db_node = next(n for n in graph_data["nodes"] if n["id"] == "src/lib/db.ts")
    assert db_node["in_degree"] >= 1


def test_repo_map_generator_output(tmp_path: Path):
    """RepoMapGenerator writes valid Markdown with symbols and line numbers."""
    (tmp_path / "src").mkdir(parents=True)
    (tmp_path / "src" / "calculator.ts").write_text(
        "export function add(a: number, b: number): number {\n    return a + b;\n}\n"
    )

    out_file = tmp_path / "REPO_MAP.md"
    config = MapperConfig(root_dir=tmp_path, repo_map_output=out_file)
    gen = RepoMapGenerator(config)
    content = gen.generate()

    assert out_file.exists()
    assert "### `src/calculator.ts`" in content
    assert "export function add" in content
    assert "1:" in content


def test_visualizer_generation(tmp_path: Path):
    """VisualizerGenerator creates visualizer/index.html and graph.json."""
    config = MapperConfig(root_dir=tmp_path)
    sample_graph = {
        "metadata": {"total_files": 1, "total_nodes": 1, "total_edges": 0, "languages": {}},
        "groups": [{"id": "src", "name": "src", "color": "#3b82f6", "count": 1}],
        "nodes": [{"id": "src/main.ts", "label": "main.ts", "path": "src/main.ts", "group": "src", "color": "#3b82f6", "loc": 10}],
        "edges": [],
    }
    gen = VisualizerGenerator(config)
    html_path = gen.generate(sample_graph)

    assert html_path.exists()
    assert (config.visualizer_dir / "graph.json").exists()
    assert (config.root_dir / "graph.json").exists()

    html_text = html_path.read_text(encoding="utf-8")
    assert "Codebase Architecture Graph" in html_text
    assert "d3.forceSimulation" in html_text


# =====================================================================
# EDGE-CASE TESTS
# =====================================================================

def test_empty_file_handling(tmp_path: Path):
    """Empty files do not crash the parser or crawler."""
    empty_file = tmp_path / "empty.ts"
    empty_file.write_text("")

    parser = CodebaseParser()
    res = parser.parse_file("empty.ts", empty_file, ".ts")
    assert res.symbols == []
    assert res.imports == []


def test_malformed_syntax_fallback(tmp_path: Path):
    """Malformed or invalid code parses safely without throwing unhandled exceptions."""
    bad_file = tmp_path / "corrupt.ts"
    bad_file.write_text("export function ??? {{{ invalid syntax !!!")

    parser = CodebaseParser()
    res = parser.parse_file("corrupt.ts", bad_file, ".ts")
    assert isinstance(res, ParsedFile)


def test_circular_imports(tmp_path: Path):
    """Circular imports between modules do not cause infinite loops or crashes."""
    (tmp_path / "src").mkdir(parents=True)
    (tmp_path / "src" / "a.ts").write_text("import { b } from './b'; export const a = 1;")
    (tmp_path / "src" / "b.ts").write_text("import { a } from './a'; export const b = 2;")

    config = MapperConfig(root_dir=tmp_path)
    builder = GraphBuilder(config)
    data = builder.build()

    node_ids = {n["id"] for n in data["nodes"]}
    assert "src/a.ts" in node_ids
    assert "src/b.ts" in node_ids
    assert len(data["edges"]) == 2
