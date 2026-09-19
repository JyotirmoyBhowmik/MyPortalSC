"""
Interactive D3.js visual graph dashboard generator.
Generates visualizer/index.html with search, filtering, cluster colors, and inspector drawer.
"""

import json
from pathlib import Path
from typing import Any, Dict

from .config import MapperConfig


HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Codebase Architecture Graph | MyPortalSC</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- D3.js v7 CDN -->
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f0fdf4',
              500: '#10b981',
              600: '#059669',
              900: '#064e3b',
            }
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #090d16;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
    }
    .grid-bg {
      background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .node-circle {
      stroke-width: 1.5px;
      cursor: pointer;
      transition: r 0.2s, stroke-width 0.2s, filter 0.2s;
    }
    .node-circle:hover {
      stroke-width: 3px;
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
    }
    .node-selected {
      stroke: #ffffff !important;
      stroke-width: 3.5px !important;
      filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.9)) !important;
    }
    .link {
      stroke-opacity: 0.35;
      transition: stroke-opacity 0.2s, stroke-width 0.2s;
    }
    .link-highlighted {
      stroke-opacity: 0.95 !important;
      stroke-width: 2.5px !important;
    }
    .link-incoming {
      stroke: #38bdf8 !important;
    }
    .link-outgoing {
      stroke: #ec4899 !important;
    }
    .node-label {
      font-size: 10px;
      fill: #cbd5e1;
      pointer-events: none;
      user-select: none;
      font-family: monospace;
      text-shadow: 0 1px 3px rgba(0,0,0,0.9);
    }
    .node-dimmed {
      opacity: 0.15;
    }
    .link-dimmed {
      stroke-opacity: 0.05 !important;
    }
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0f172a;
    }
    ::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 3px;
    }
  </style>
</head>
<body class="h-screen w-screen flex flex-col grid-bg select-none">

  <!-- Header Bar -->
  <header class="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 flex items-center justify-between z-20 shrink-0">
    <div class="flex items-center space-x-3">
      <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
        M
      </div>
      <div>
        <h1 class="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          MyPortalSC <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">Architecture Graph</span>
        </h1>
        <p class="text-[11px] text-slate-400 font-mono" id="header-stats">Loading metadata...</p>
      </div>
    </div>

    <!-- Search Bar & Controls -->
    <div class="flex items-center space-x-3">
      <!-- Search -->
      <div class="relative w-72">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Search modules, paths, symbols..." 
          class="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
        />
        <div id="search-results" class="hidden absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-h-64 overflow-y-auto z-50"></div>
      </div>

      <!-- Controls -->
      <button id="btn-fit" title="Fit to Screen" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
        Fit
      </button>

      <button id="btn-physics" title="Toggle Simulation Physics" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1">
        <span id="physics-icon">⏸️</span>
        <span id="physics-text">Pause</span>
      </button>

      <!-- Sizing dropdown -->
      <select id="size-mode" class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono">
        <option value="degree">Size: Connections</option>
        <option value="loc">Size: Lines of Code</option>
        <option value="uniform">Size: Uniform</option>
      </select>
    </div>
  </header>

  <!-- Main Viewport -->
  <div class="flex-1 relative flex overflow-hidden">

    <!-- Filter & Legend Sidebar -->
    <aside class="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur p-3 flex flex-col gap-4 overflow-y-auto z-10 shrink-0 text-xs">
      <div>
        <h2 class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Display Filters</h2>
        <label class="flex items-center space-x-2 text-slate-300 cursor-pointer mb-2">
          <input type="checkbox" id="toggle-external" checked class="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0">
          <span>Include External NPM Packages</span>
        </label>
        <label class="flex items-center space-x-2 text-slate-300 cursor-pointer mb-2">
          <input type="checkbox" id="toggle-labels" checked class="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0">
          <span>Show Node Labels</span>
        </label>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Module Clusters</h2>
          <button id="btn-reset-filters" class="text-[10px] text-indigo-400 hover:underline">Reset</button>
        </div>
        <div id="group-filters" class="flex flex-col gap-1.5"></div>
      </div>

      <div class="mt-auto border-t border-slate-800/80 pt-3">
        <h2 class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Edge Connection Legend</h2>
        <div class="space-y-1 text-[11px]">
          <div class="flex items-center gap-2">
            <span class="w-3 h-0.5 bg-sky-400 inline-block"></span>
            <span class="text-sky-300">Incoming Dependency (Imported by)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-0.5 bg-pink-500 inline-block"></span>
            <span class="text-pink-300">Outgoing Dependency (Imports)</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Graph Canvas Container -->
    <div id="graph-container" class="flex-1 relative h-full w-full">
      <svg id="graph-svg" class="w-full h-full"></svg>
      <div id="loading-overlay" class="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-3 z-30">
        <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm font-mono text-slate-300">Rendering Codebase Architecture Graph...</p>
      </div>
    </div>

    <!-- Inspector Drawer (Right Side) -->
    <aside id="inspector-drawer" class="hidden w-96 border-l border-slate-800 bg-slate-900/90 backdrop-blur flex flex-col z-20 shrink-0 text-xs overflow-hidden shadow-2xl">
      <div class="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
        <div class="flex items-center gap-2 truncate">
          <span id="drawer-group-badge" class="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold">GROUP</span>
          <span id="drawer-title" class="font-bold text-white truncate text-sm">module.ts</span>
        </div>
        <button id="btn-close-drawer" class="text-slate-400 hover:text-white text-base px-1">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Path & Quick Stats -->
        <div>
          <label class="text-[10px] uppercase text-slate-500 font-semibold">File Path</label>
          <div id="drawer-path" class="font-mono text-slate-200 break-all bg-slate-950/60 p-2 rounded border border-slate-800 text-[11px] mt-1 select-text"></div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-slate-800/50 p-2 rounded border border-slate-800">
            <div id="drawer-loc" class="text-sm font-bold text-white font-mono">0</div>
            <div class="text-[10px] text-slate-400 uppercase">Lines</div>
          </div>
          <div class="bg-slate-800/50 p-2 rounded border border-slate-800">
            <div id="drawer-in" class="text-sm font-bold text-sky-400 font-mono">0</div>
            <div class="text-[10px] text-slate-400 uppercase">In-Degree</div>
          </div>
          <div class="bg-slate-800/50 p-2 rounded border border-slate-800">
            <div id="drawer-out" class="text-sm font-bold text-pink-400 font-mono">0</div>
            <div class="text-[10px] text-slate-400 uppercase">Out-Degree</div>
          </div>
        </div>

        <!-- Symbols & Signatures -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-[10px] uppercase text-slate-500 font-semibold">Key Symbols & Signatures</label>
            <span id="drawer-symbol-count" class="text-[10px] text-slate-400 font-mono">0 symbols</span>
          </div>
          <div id="drawer-symbols" class="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800 select-text"></div>
        </div>

        <!-- Incoming Imports (Who uses this) -->
        <div>
          <label class="text-[10px] uppercase text-slate-500 font-semibold">Imported By (Incoming)</label>
          <div id="drawer-incoming" class="mt-1 space-y-1 max-h-36 overflow-y-auto"></div>
        </div>

        <!-- Outgoing Imports (Dependencies) -->
        <div>
          <label class="text-[10px] uppercase text-slate-500 font-semibold">Imports (Outgoing)</label>
          <div id="drawer-outgoing" class="mt-1 space-y-1 max-h-36 overflow-y-auto"></div>
        </div>
      </div>
    </aside>

  </div>

  <!-- Fallback Embedded Graph Data for standalone offline use -->
  <script id="fallback-graph-data" type="application/json">
__GRAPH_DATA_PLACEHOLDER__
  </script>

  <!-- Application Logic -->
  <script>
    let graphData = null;
    let simulation = null;
    let svg, g, linkElements, nodeElements, labelElements;
    let width, height;
    let activeFilters = new Set();
    let showExternal = true;
    let showLabels = true;
    let sizeMode = 'degree';
    let selectedNode = null;
    let isPhysicsRunning = true;

    async function loadGraphData() {
      // 1. Try fetching external graph.json
      try {
        const res = await fetch('./graph.json');
        if (res.ok) {
          graphData = await res.json();
          initGraph();
          return;
        }
      } catch (e) {
        console.log('HTTP fetch failed, checking fallback payload...');
      }

      // 2. Fallback to embedded script tag
      const fallbackTag = document.getElementById('fallback-graph-data');
      if (fallbackTag && fallbackTag.textContent.trim()) {
        try {
          graphData = JSON.parse(fallbackTag.textContent.trim());
          initGraph();
          return;
        } catch (e) {
          console.error('Failed to parse fallback graph payload', e);
        }
      }

      document.getElementById('loading-overlay').innerHTML = `
        <div class="text-rose-400 font-mono text-sm">Failed to load graph data. Ensure graph.json is generated.</div>
      `;
    }

    function initGraph() {
      try {
        document.getElementById('loading-overlay').classList.add('hidden');

        // Update header statistics
        const meta = graphData.metadata;
        document.getElementById('header-stats').textContent = 
          `${meta.total_files} Files · ${meta.total_nodes} Total Nodes · ${meta.total_edges} Connections`;

        // Initialize group filters
        renderGroupFilters();

        // Setup D3 canvas
        const container = document.getElementById('graph-container');
        width = container.clientWidth || window.innerWidth || 1200;
        height = container.clientHeight || window.innerHeight || 800;

        svg = d3.select('#graph-svg')
          .attr('viewBox', [0, 0, width, height]);

      // Define arrowhead markers
      const defs = svg.append('defs');
      defs.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 18)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#475569');

      defs.append('marker')
        .attr('id', 'arrow-highlight')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 7)
        .attr('markerHeight', 7)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#38bdf8');

      g = svg.append('g');

      // Zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([0.1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
      svg.call(zoom);

      // Fit button handler
      document.getElementById('btn-fit').addEventListener('click', () => {
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85).translate(-width / 2, -height / 2)
        );
      });

      renderSimulation();

      // Check URL query parameters for auto-selection (e.g. ?select=src/proxy.ts)
      const urlParams = new URLSearchParams(window.location.search);
      const autoSelect = urlParams.get('select');
      if (autoSelect) {
        const found = graphData.nodes.find(n => n.id === autoSelect || n.label === autoSelect || n.path === autoSelect);
        if (found) {
          setTimeout(() => selectNode(found), 600);
        }
      }
      } catch (err) {
        console.error('initGraph error:', err);
        document.getElementById('loading-overlay').innerHTML = `
          <div class="text-rose-400 font-mono text-sm">Initialization error: ${err.message}</div>
        `;
      }
    }

    function getNodeRadius(node) {
      if (sizeMode === 'uniform') return 6;
      if (sizeMode === 'loc') {
        const loc = node.loc || 10;
        return Math.min(24, Math.max(5, Math.sqrt(loc) * 1.2));
      }
      // Degree sizing
      const deg = (node.in_degree || 0) + (node.out_degree || 0);
      return Math.min(22, Math.max(5, 5 + Math.sqrt(deg) * 2.5));
    }

    function filterData() {
      let filteredNodes = graphData.nodes.filter(n => {
        if (!showExternal && n.is_external) return false;
        if (activeFilters.size > 0 && !activeFilters.has(n.group)) return false;
        return true;
      });

      const nodeSet = new Set(filteredNodes.map(n => n.id));
      let filteredEdges = graphData.edges.filter(e => {
        const srcId = typeof e.source === 'object' ? e.source.id : e.source;
        const tgtId = typeof e.target === 'object' ? e.target.id : e.target;
        return nodeSet.has(srcId) && nodeSet.has(tgtId);
      });

      return { nodes: filteredNodes, edges: filteredEdges };
    }

    function renderSimulation() {
      const { nodes, edges } = filterData();

      // Deep copy to prevent mutation issues with D3 simulation
      const simNodes = nodes.map(d => Object.assign({}, d));
      const simEdges = edges.map(d => Object.assign({}, d));

      g.selectAll('*').remove();

      // Links layer
      linkElements = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(simEdges)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke', '#334155')
        .attr('stroke-width', 1.2)
        .attr('marker-end', 'url(#arrow)');

      // Nodes layer
      nodeElements = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(simNodes)
        .enter().append('circle')
        .attr('class', 'node-circle')
        .attr('r', d => getNodeRadius(d))
        .attr('fill', d => d.color || '#64748b')
        .attr('stroke', d => (d3.color(d.color) || d3.color('#64748b')).darker(0.8))
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
        )
        .on('click', (event, d) => {
          event.stopPropagation();
          selectNode(d);
        })
        .on('mouseenter', (event, d) => highlightNeighbors(d))
        .on('mouseleave', () => resetHighlights());

      // Labels layer
      labelElements = g.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(simNodes)
        .enter().append('text')
        .attr('class', 'node-label')
        .attr('dx', d => getNodeRadius(d) + 4)
        .attr('dy', '.35em')
        .text(d => d.label)
        .style('display', showLabels ? 'block' : 'none');

      svg.on('click', () => {
        closeDrawer();
        resetHighlights();
      });

      // Simulation setup
      if (simulation) simulation.stop();
      simulation = d3.forceSimulation(simNodes)
        .force('link', d3.forceLink(simEdges).id(d => d.id).distance(60))
        .force('charge', d3.forceManyBody().strength(-120).distanceMax(450))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 4))
        .on('tick', () => {
          linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          nodeElements
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

          labelElements
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        });

      isPhysicsRunning = true;
      document.getElementById('physics-icon').textContent = '⏸️';
      document.getElementById('physics-text').textContent = 'Pause';
    }

    function dragstarted(event, d) {
      if (!event.active && simulation) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active && simulation) simulation.alphaTarget(0);
      // Keep pinned for user exploration
    }

    function highlightNeighbors(node) {
      if (selectedNode) return; // Keep selected state locked if opened

      const connectedNodeIds = new Set([node.id]);
      const incomingNodeIds = new Set();
      const outgoingNodeIds = new Set();

      linkElements.each(function(l) {
        const srcId = l.source.id;
        const tgtId = l.target.id;
        if (srcId === node.id) {
          connectedNodeIds.add(tgtId);
          outgoingNodeIds.add(tgtId);
          d3.select(this)
            .classed('link-highlighted link-outgoing', true)
            .classed('link-dimmed', false);
        } else if (tgtId === node.id) {
          connectedNodeIds.add(srcId);
          incomingNodeIds.add(srcId);
          d3.select(this)
            .classed('link-highlighted link-incoming', true)
            .classed('link-dimmed', false);
        } else {
          d3.select(this)
            .classed('link-dimmed', true)
            .classed('link-highlighted link-incoming link-outgoing', false);
        }
      });

      nodeElements.classed('node-dimmed', d => !connectedNodeIds.has(d.id));
      labelElements.classed('node-dimmed', d => !connectedNodeIds.has(d.id));
    }

    function resetHighlights() {
      if (selectedNode) return;
      linkElements.classed('link-dimmed link-highlighted link-incoming link-outgoing', false);
      nodeElements.classed('node-dimmed node-selected', false);
      labelElements.classed('node-dimmed', false);
    }

    function selectNode(node) {
      selectedNode = node;
      nodeElements.classed('node-selected', d => d.id === node.id);

      // Highlight connections
      linkElements.each(function(l) {
        const srcId = l.source.id;
        const tgtId = l.target.id;
        if (srcId === node.id) {
          d3.select(this).classed('link-highlighted link-outgoing', true).classed('link-dimmed', false);
        } else if (tgtId === node.id) {
          d3.select(this).classed('link-highlighted link-incoming', true).classed('link-dimmed', false);
        } else {
          d3.select(this).classed('link-dimmed', true).classed('link-highlighted link-incoming link-outgoing', false);
        }
      });

      // Populate Inspector Drawer
      const drawer = document.getElementById('inspector-drawer');
      drawer.classList.remove('hidden');

      document.getElementById('drawer-title').textContent = node.label;
      const groupBadge = document.getElementById('drawer-group-badge');
      groupBadge.textContent = node.group;
      groupBadge.style.backgroundColor = `${node.color}25`;
      groupBadge.style.color = node.color;

      document.getElementById('drawer-path').textContent = node.path;
      document.getElementById('drawer-loc').textContent = (node.loc || 0).toLocaleString();
      document.getElementById('drawer-in').textContent = node.in_degree || 0;
      document.getElementById('drawer-out').textContent = node.out_degree || 0;

      // Symbols list
      const symContainer = document.getElementById('drawer-symbols');
      symContainer.innerHTML = '';
      const symbols = node.symbol_details || [];
      document.getElementById('drawer-symbol-count').textContent = `${symbols.length} symbols`;

      if (symbols.length === 0) {
        symContainer.innerHTML = '<div class="text-slate-500 italic">No top-level functions or classes defined.</div>';
      } else {
        symbols.forEach(s => {
          const item = document.createElement('div');
          item.className = 'py-0.5 border-b border-slate-800/60 last:border-0 flex items-start gap-1.5';
          item.innerHTML = `
            <span class="text-indigo-400 font-semibold select-none text-[10px]">L${s.line}</span>
            <span class="text-slate-300 break-all">${s.signature}</span>
          `;
          symContainer.appendChild(item);
        });
      }

      // Incoming dependencies
      const incContainer = document.getElementById('drawer-incoming');
      incContainer.innerHTML = '';
      const incomingEdges = graphData.edges.filter(e => {
        const tgtId = typeof e.target === 'object' ? e.target.id : e.target;
        return tgtId === node.id;
      });

      if (incomingEdges.length === 0) {
        incContainer.innerHTML = '<div class="text-slate-500 italic text-[11px]">No modules import this file directly.</div>';
      } else {
        incomingEdges.forEach(e => {
          const srcId = typeof e.source === 'object' ? e.source.id : e.source;
          const btn = document.createElement('button');
          btn.className = 'w-full text-left px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-sky-300 truncate font-mono text-[11px] block border border-slate-700/50';
          btn.textContent = srcId;
          btn.onclick = () => {
            const targetNode = graphData.nodes.find(n => n.id === srcId);
            if (targetNode) selectNode(targetNode);
          };
          incContainer.appendChild(btn);
        });
      }

      // Outgoing dependencies
      const outContainer = document.getElementById('drawer-outgoing');
      outContainer.innerHTML = '';
      const outgoingEdges = graphData.edges.filter(e => {
        const srcId = typeof e.source === 'object' ? e.source.id : e.source;
        return srcId === node.id;
      });

      if (outgoingEdges.length === 0) {
        outContainer.innerHTML = '<div class="text-slate-500 italic text-[11px]">No dependencies imported.</div>';
      } else {
        outgoingEdges.forEach(e => {
          const tgtId = typeof e.target === 'object' ? e.target.id : e.target;
          const btn = document.createElement('button');
          btn.className = 'w-full text-left px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-pink-300 truncate font-mono text-[11px] block border border-slate-700/50';
          btn.textContent = tgtId;
          btn.onclick = () => {
            const targetNode = graphData.nodes.find(n => n.id === tgtId);
            if (targetNode) selectNode(targetNode);
          };
          outContainer.appendChild(btn);
        });
      }
    }

    function closeDrawer() {
      selectedNode = null;
      document.getElementById('inspector-drawer').classList.add('hidden');
      nodeElements.classed('node-selected', false);
      resetHighlights();
    }

    function renderGroupFilters() {
      const container = document.getElementById('group-filters');
      container.innerHTML = '';

      graphData.groups.forEach(g => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-1.5 rounded hover:bg-slate-800/50 cursor-pointer transition';
        item.innerHTML = `
          <div class="flex items-center gap-2 truncate">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${g.color}"></span>
            <span class="truncate text-slate-300">${g.name}</span>
          </div>
          <span class="text-[10px] font-mono text-slate-500 px-1 rounded bg-slate-800">${g.count}</span>
        `;
        item.onclick = () => {
          if (activeFilters.has(g.id)) {
            activeFilters.delete(g.id);
            item.classList.remove('ring-1', 'ring-indigo-500');
          } else {
            activeFilters.add(g.id);
            item.classList.add('ring-1', 'ring-indigo-500');
          }
          renderSimulation();
        };
        container.appendChild(item);
      });
    }

    // UI Event Listeners
    document.getElementById('btn-close-drawer').addEventListener('click', closeDrawer);

    document.getElementById('btn-reset-filters').addEventListener('click', () => {
      activeFilters.clear();
      document.querySelectorAll('#group-filters > div').forEach(el => el.classList.remove('ring-1', 'ring-indigo-500'));
      renderSimulation();
    });

    document.getElementById('toggle-external').addEventListener('change', (e) => {
      showExternal = e.target.checked;
      renderSimulation();
    });

    document.getElementById('toggle-labels').addEventListener('change', (e) => {
      showLabels = e.target.checked;
      labelElements.style('display', showLabels ? 'block' : 'none');
    });

    document.getElementById('size-mode').addEventListener('change', (e) => {
      sizeMode = e.target.value;
      nodeElements.transition().duration(300).attr('r', d => getNodeRadius(d));
      labelElements.transition().duration(300).attr('dx', d => getNodeRadius(d) + 4);
      if (simulation) simulation.alpha(0.2).restart();
    });

    document.getElementById('btn-physics').addEventListener('click', () => {
      if (!simulation) return;
      if (isPhysicsRunning) {
        simulation.stop();
        isPhysicsRunning = false;
        document.getElementById('physics-icon').textContent = '▶️';
        document.getElementById('physics-text').textContent = 'Resume';
      } else {
        simulation.alpha(0.3).restart();
        isPhysicsRunning = true;
        document.getElementById('physics-icon').textContent = '⏸️';
        document.getElementById('physics-text').textContent = 'Pause';
      }
    });

    // Search bar live filtering
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        searchResults.classList.add('hidden');
        return;
      }

      const matches = graphData.nodes.filter(n => {
        if (n.path.toLowerCase().includes(q)) return true;
        if (n.symbols && n.symbols.some(s => s.toLowerCase().includes(q))) return true;
        return false;
      }).slice(0, 15);

      searchResults.innerHTML = '';
      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="p-2 text-slate-500 text-center font-mono">No matching modules</div>';
      } else {
        matches.forEach(m => {
          const row = document.createElement('div');
          row.className = 'p-2 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 last:border-0';
          row.innerHTML = `
            <div class="font-semibold text-slate-200 truncate">${m.label}</div>
            <div class="text-[10px] text-slate-500 font-mono truncate">${m.path}</div>
          `;
          row.onclick = () => {
            searchInput.value = m.label;
            searchResults.classList.add('hidden');
            selectNode(m);
            // Zoom in to node position if rendered
            const foundElement = nodeElements.filter(d => d.id === m.id);
            if (!foundElement.empty()) {
              const nodeData = foundElement.datum();
              svg.transition().duration(750).call(
                d3.zoom().transform,
                d3.zoomIdentity.translate(width / 2 - nodeData.x * 1.5, height / 2 - nodeData.y * 1.5).scale(1.5)
              );
            }
          };
          searchResults.appendChild(row);
        });
      }
      searchResults.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add('hidden');
      }
    });

    // Start loading data
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', loadGraphData);
    } else {
      loadGraphData();
    }
  </script>
</body>
</html>
"""


class VisualizerGenerator:
    def __init__(self, config: MapperConfig):
        self.config = config

    def generate(self, graph_data: Dict[str, Any]) -> Path:
        out_dir = self.config.visualizer_dir
        out_dir.mkdir(parents=True, exist_ok=True)

        # 1. Save graph.json to visualizer/graph.json, root graph.json, and public/graph.json
        viz_json = out_dir / "graph.json"
        with open(viz_json, "w", encoding="utf-8") as f:
            json.dump(graph_data, f, indent=2)

        root_json = self.config.graph_output
        with open(root_json, "w", encoding="utf-8") as f:
            json.dump(graph_data, f, indent=2)

        public_json = self.config.root_dir / "public" / "graph.json"
        try:
            with open(public_json, "w", encoding="utf-8") as f:
                json.dump(graph_data, f, indent=2)
        except Exception:
            pass

        # 2. Build index.html with embedded fallback data
        raw_json_str = json.dumps(graph_data)
        html_content = HTML_TEMPLATE.replace("__GRAPH_DATA_PLACEHOLDER__", raw_json_str)

        html_file = out_dir / "index.html"
        with open(html_file, "w", encoding="utf-8") as f:
            f.write(html_content)

        return html_file
