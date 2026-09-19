"""
Graph builder compiling module dependencies, imports, and call references into graph.json structure.
"""

from collections import defaultdict
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Set

from .config import GROUP_COLORS, MapperConfig
from .crawler import FileEntry, RepoCrawler
from .parser import CodebaseParser, ParsedFile
from .resolver import PathResolver


def classify_group(rel_path: str) -> str:
    """Classifies a relative path into a visual grouping bucket."""
    p = rel_path.lower()
    if p.startswith("src/app/api/"):
        return "src/app/api"
    elif p.startswith("src/app/admin/"):
        return "src/app/admin"
    elif p.startswith("src/app/"):
        return "src/app"
    elif p.startswith("src/components/"):
        return "src/components"
    elif p.startswith("src/lib/"):
        return "src/lib"
    elif p.startswith("scripts/"):
        return "scripts"
    elif p.startswith("supabase/"):
        return "supabase"
    elif "/" not in p:
        return "root"
    return "other"


class GraphBuilder:
    def __init__(self, config: MapperConfig):
        self.config = config
        self.crawler = RepoCrawler(config.root_dir)
        self.parser = CodebaseParser()

    def build(self) -> Dict[str, Any]:
        files: List[FileEntry] = list(self.crawler.crawl())
        known_rel_paths: Set[str] = {f.rel_path for f in files}
        resolver = PathResolver(self.config.root_dir, known_files=known_rel_paths)

        parsed_files: Dict[str, ParsedFile] = {}
        for entry in files:
            parsed = self.parser.parse_file(entry.rel_path, entry.abs_path, entry.extension)
            parsed_files[entry.rel_path] = parsed

        # Node containers
        nodes_dict: Dict[str, Dict[str, Any]] = {}
        # Edge containers: keyed by (source, target, type)
        edges_map: Dict[tuple, Dict[str, Any]] = defaultdict(lambda: {"count": 0, "specifiers": set()})

        # 1. Create nodes for all parsed files
        for entry in files:
            group = classify_group(entry.rel_path)
            parsed = parsed_files.get(entry.rel_path)
            symbols = [s.name for s in parsed.symbols] if parsed else []
            sym_details = [
                {
                    "name": s.name,
                    "kind": s.kind,
                    "signature": s.signature,
                    "line": s.line_number,
                    "exported": s.is_exported,
                }
                for s in (parsed.symbols if parsed else [])
            ]

            nodes_dict[entry.rel_path] = {
                "id": entry.rel_path,
                "label": Path(entry.rel_path).name,
                "path": entry.rel_path,
                "directory": str(Path(entry.rel_path).parent).replace("\\", "/"),
                "group": group,
                "color": GROUP_COLORS.get(group, "#94a3b8"),
                "extension": entry.extension,
                "loc": entry.line_count,
                "size_bytes": entry.size_bytes,
                "symbols": symbols,
                "symbol_details": sym_details,
                "exports": parsed.exports if parsed else [],
                "calls": parsed.calls if parsed else [],
                "in_degree": 0,
                "out_degree": 0,
                "is_external": False,
            }

        # 2. Extract edges and identify external dependencies
        external_nodes: Dict[str, Dict[str, Any]] = {}

        for rel_path, parsed in parsed_files.items():
            for imp in parsed.imports:
                resolved = resolver.resolve(rel_path, imp.source)
                if not resolved.target_id or resolved.target_id == rel_path:
                    continue

                if resolved.is_external:
                    if self.config.include_external_nodes:
                        ext_id = resolved.target_id
                        if ext_id not in external_nodes:
                            external_nodes[ext_id] = {
                                "id": ext_id,
                                "label": resolved.display_name,
                                "path": ext_id,
                                "directory": "external",
                                "group": "external",
                                "color": GROUP_COLORS["external"],
                                "extension": ".npm",
                                "loc": 0,
                                "size_bytes": 0,
                                "symbols": [],
                                "symbol_details": [],
                                "exports": [],
                                "calls": [],
                                "in_degree": 0,
                                "out_degree": 0,
                                "is_external": True,
                            }
                        edge_key = (rel_path, ext_id, "import")
                        edges_map[edge_key]["count"] += 1
                        edges_map[edge_key]["specifiers"].update(imp.specifiers)
                else:
                    # Internal dependency
                    tgt_id = resolved.target_id
                    # If target not in nodes_dict (e.g. unparsed config or missing file), register placeholder
                    if tgt_id not in nodes_dict:
                        tgt_group = classify_group(tgt_id)
                        nodes_dict[tgt_id] = {
                            "id": tgt_id,
                            "label": Path(tgt_id).name,
                            "path": tgt_id,
                            "directory": str(Path(tgt_id).parent).replace("\\", "/"),
                            "group": tgt_group,
                            "color": GROUP_COLORS.get(tgt_group, "#94a3b8"),
                            "extension": Path(tgt_id).suffix,
                            "loc": 0,
                            "size_bytes": 0,
                            "symbols": [],
                            "symbol_details": [],
                            "exports": [],
                            "calls": [],
                            "in_degree": 0,
                            "out_degree": 0,
                            "is_external": False,
                        }

                    edge_key = (rel_path, tgt_id, "import")
                    edges_map[edge_key]["count"] += 1
                    edges_map[edge_key]["specifiers"].update(imp.specifiers)

        # Merge external nodes if enabled
        all_nodes = dict(nodes_dict)
        if self.config.include_external_nodes:
            all_nodes.update(external_nodes)

        # 3. Format edges & compute in/out degrees
        edges_list: List[Dict[str, Any]] = []
        for (src, tgt, rel_type), data in edges_map.items():
            if src in all_nodes and tgt in all_nodes:
                all_nodes[src]["out_degree"] += 1
                all_nodes[tgt]["in_degree"] += 1
                edges_list.append(
                    {
                        "source": src,
                        "target": tgt,
                        "type": rel_type,
                        "count": data["count"],
                        "specifiers": sorted(list(data["specifiers"])),
                    }
                )

        # Language distribution
        lang_counts: Dict[str, int] = defaultdict(int)
        for n in nodes_dict.values():
            ext = n["extension"].lower()
            lang_counts[ext] += 1

        # Groups list with colors and counts
        group_counts: Dict[str, int] = defaultdict(int)
        for n in all_nodes.values():
            group_counts[n["group"]] += 1

        groups_meta = [
            {
                "id": g,
                "name": g,
                "color": GROUP_COLORS.get(g, "#94a3b8"),
                "count": count,
            }
            for g, count in sorted(group_counts.items(), key=lambda x: -x[1])
        ]

        metadata = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_files": len(nodes_dict),
            "total_nodes": len(all_nodes),
            "total_edges": len(edges_list),
            "languages": dict(lang_counts),
        }

        return {
            "metadata": metadata,
            "groups": groups_meta,
            "nodes": list(all_nodes.values()),
            "edges": edges_list,
        }
