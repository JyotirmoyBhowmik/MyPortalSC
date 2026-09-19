"""
Unified CLI entrypoint for codebase mapping utility.
Supports --all, --repo-map, --graph, and --serve flags.
"""

import argparse
import sys
from pathlib import Path

if __package__ is None or __package__ == "":
    repo_root = Path(__file__).resolve().parent.parent.parent
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))
    from scripts.codebase_mapper.config import MapperConfig
    from scripts.codebase_mapper.graph_builder import GraphBuilder
    from scripts.codebase_mapper.repo_map_generator import RepoMapGenerator
    from scripts.codebase_mapper.server import run_server
    from scripts.codebase_mapper.visualizer_generator import VisualizerGenerator
else:
    from .config import MapperConfig
    from .graph_builder import GraphBuilder
    from .repo_map_generator import RepoMapGenerator
    from .server import run_server
    from .visualizer_generator import VisualizerGenerator


def main():
    parser = argparse.ArgumentParser(
        description="Zero-LLM-cost codebase mapping utility (Aider-style & Graphify-style)."
    )
    parser.add_argument(
        "--all",
        action="store_true",
        default=False,
        help="Generate both REPO_MAP.md and interactive visual graph.json + index.html (default if no mode specified)",
    )
    parser.add_argument(
        "--repo-map",
        action="store_true",
        help="Generate compact Aider-style REPO_MAP.md only",
    )
    parser.add_argument(
        "--graph",
        action="store_true",
        help="Generate Graphify-style graph.json and visualizer/index.html only",
    )
    parser.add_argument(
        "--serve",
        nargs="?",
        const=3333,
        type=int,
        help="Start local server to inspect interactive visualizer (default port: 3333)",
    )
    parser.add_argument(
        "--no-external",
        action="store_true",
        help="Exclude external third-party packages from graph nodes",
    )
    parser.add_argument(
        "--root",
        type=str,
        default=".",
        help="Repository root directory (defaults to current working directory)",
    )

    args = parser.parse_args()

    # Default to --all if neither --repo-map nor --graph explicitly requested
    do_all = args.all or (not args.repo_map and not args.graph)
    do_repo_map = do_all or args.repo_map
    do_graph = do_all or args.graph

    root_path = Path(args.root).resolve()
    config = MapperConfig(
        root_dir=root_path,
        include_external_nodes=not args.no_external,
    )

    print("=" * 60)
    print("  Codebase Mapping Engine (Aider-Style & Graphify-Style)")
    print("=" * 60)
    print(f"Target Root Directory: {config.root_dir}")

    # 1. Aider-Style Repo Map
    if do_repo_map:
        print("\n[1/2] Generating Aider-style REPO_MAP.md...")
        repo_gen = RepoMapGenerator(config)
        content = repo_gen.generate()
        print(f"  -> Generated {config.repo_map_output.name} ({len(content):,} chars)")

    # 2. Graphify-Style Visual Graph
    if do_graph:
        print("\n[2/2] Synthesizing Graphify-style visual graph & dashboard...")
        builder = GraphBuilder(config)
        graph_data = builder.build()
        viz_gen = VisualizerGenerator(config)
        html_path = viz_gen.generate(graph_data)
        meta = graph_data["metadata"]
        print(f"  -> Generated {config.graph_output.name} ({meta['total_nodes']} nodes, {meta['total_edges']} edges)")
        print(f"  -> Generated {html_path.relative_to(config.root_dir)} (Interactive D3 Dashboard)")

    print("\n[SUCCESS] Codebase mapping completed successfully!")

    # 3. Serve mode
    if args.serve is not None:
        port = args.serve
        print(f"\nLaunching interactive dashboard on port {port}...")
        port_used, httpd = run_server(config.visualizer_dir, port)
        print(f"Open your browser at: http://localhost:{port_used}/")
        print("Press Ctrl+C to stop the server.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.server_close()


if __name__ == "__main__":
    main()
