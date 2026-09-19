"""
Lightweight HTTP server to serve the visualizer with CORS headers and automatic port fallback.
"""

import http.server
import socketserver
import sys
from pathlib import Path


class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        # Quiet standard logging unless error
        if args and str(args[1])[0] in ("4", "5"):
            super().log_message(format, *args)


def run_server(directory: Path, port: int = 3333, max_tries: int = 10) -> tuple[int, http.server.HTTPServer]:
    directory = Path(directory).resolve()
    handler = lambda *args, **kwargs: CORSRequestHandler(*args, directory=str(directory), **kwargs)

    current_port = port
    for _ in range(max_tries):
        try:
            httpd = socketserver.TCPServer(("", current_port), handler)
            print(f"Server started at http://localhost:{current_port}/ (serving {directory})")
            return current_port, httpd
        except OSError as e:
            if "Address already in use" in str(e) or e.errno == 10048:
                current_port += 1
            else:
                raise

    raise RuntimeError(f"Could not bind to any port in range {port} - {current_port}")


if __name__ == "__main__":
    serve_dir = Path(__file__).parent.parent.parent / "visualizer"
    p = int(sys.argv[1]) if len(sys.argv) > 1 else 3333
    port_used, httpd = run_server(serve_dir, p)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()
