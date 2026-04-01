"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TopoNode {
    id: string;
    label: string;
    icon: string;
    description: string;
    tech: string[];
    x: number;
    y: number;
    ring: number; // 0 = center, 1 = inner, 2 = outer
    color: string;
}

interface TopoLink {
    from: string;
    to: string;
    label?: string;
}

const nodes: TopoNode[] = [
    // Center
    { id: "core", label: "Core Switch", icon: "🔲", description: "L3 Core backbone providing high-speed switching fabric", tech: ["Cisco Nexus", "10G Uplinks", "OSPF/BGP"], x: 50, y: 50, ring: 0, color: "#64ffda" },
    // Inner ring
    { id: "fw", label: "Firewall / NGFW", icon: "🛡️", description: "Perimeter and internal zone security enforcement", tech: ["Palo Alto", "Fortinet", "Check Point"], x: 50, y: 18, ring: 1, color: "#ef4444" },
    { id: "dist", label: "Distribution", icon: "🔀", description: "VLAN segmentation and policy enforcement point", tech: ["Cisco Catalyst", "802.1Q", "RADIUS"], x: 82, y: 38, ring: 1, color: "#3b82f6" },
    { id: "dc", label: "Data Center", icon: "🏢", description: "Primary DC with VMware clusters and SAP ERP", tech: ["VMware vSphere", "HPE ProLiant", "Commvault"], x: 82, y: 62, ring: 1, color: "#a78bfa" },
    { id: "dr", label: "DR Site", icon: "🔄", description: "Geo-redundant Disaster Recovery with hybrid virtual", tech: ["Hyper-V", "HPE StoreOnce", "Veeam"], x: 50, y: 82, ring: 1, color: "#f59e0b" },
    { id: "sase", label: "SASE / Zscaler", icon: "☁️", description: "Cloud-delivered zero-trust network access", tech: ["Zscaler ZIA/ZPA", "SD-WAN", "SWG"], x: 18, y: 62, ring: 1, color: "#06b6d4" },
    { id: "cloud", label: "Cloud (AWS/Azure)", icon: "🌐", description: "Public cloud IaaS/PaaS for modernization", tech: ["AWS EC2/S3", "Azure AD", "M365 E5"], x: 18, y: 38, ring: 1, color: "#22c55e" },
    // Outer ring
    { id: "ot", label: "OT / SCADA", icon: "🏭", description: "Industrial control systems with IEC 62443 alignment", tech: ["Honeywell", "Siemens", "OPC-UA"], x: 50, y: 3, ring: 2, color: "#fb923c" },
    { id: "endpoints", label: "Endpoints", icon: "💻", description: "Managed desktops, laptops and mobile devices", tech: ["Intune MDM", "SCCM", "BitLocker"], x: 92, y: 22, ring: 2, color: "#8b5cf6" },
    { id: "wifi", label: "Enterprise Wi-Fi", icon: "📶", description: "Multi-site Wi-Fi 6 with centralized management", tech: ["Cisco WLC", "802.11ax", "RADIUS"], x: 92, y: 78, ring: 2, color: "#14b8a6" },
    { id: "monitor", label: "Monitoring", icon: "📊", description: "Infrastructure observability and alerting", tech: ["Zabbix", "Tableau", "Power BI"], x: 8, y: 78, ring: 2, color: "#ec4899" },
    { id: "rpa", label: "RPA / Automation", icon: "🤖", description: "30+ bots for IT and business process automation", tech: ["UiPath", "Power Automate"], x: 8, y: 22, ring: 2, color: "#eab308" },
];

const links: TopoLink[] = [
    { from: "core", to: "fw", label: "10G" },
    { from: "core", to: "dist" },
    { from: "core", to: "dc", label: "10G" },
    { from: "core", to: "dr", label: "WAN" },
    { from: "core", to: "sase", label: "IPSec" },
    { from: "core", to: "cloud" },
    { from: "fw", to: "ot", label: "DMZ" },
    { from: "dist", to: "endpoints" },
    { from: "dist", to: "wifi" },
    { from: "dc", to: "monitor" },
    { from: "cloud", to: "rpa" },
    { from: "sase", to: "monitor" },
];

export default function NetworkTopology() {
    const [selected, setSelected] = useState<TopoNode | null>(null);

    const getNodePos = (id: string) => {
        const n = nodes.find((n) => n.id === id);
        return n ? { x: n.x, y: n.y } : { x: 50, y: 50 };
    };

    return (
        <div className="glass rounded-2xl p-6 border border-border/50 relative">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Enterprise Network Architecture
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Click any node to explore the technology stack</p>

            <div className="relative w-full" style={{ paddingBottom: "70%" }}>
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    {/* Concentric ring guides */}
                    <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.15" className="text-border" strokeDasharray="1 1" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-border" strokeDasharray="1 1" />

                    {/* Links */}
                    {links.map((link, i) => {
                        const from = getNodePos(link.from);
                        const to = getNodePos(link.to);
                        return (
                            <g key={`link-${i}`}>
                                <line
                                    x1={from.x} y1={from.y}
                                    x2={to.x} y2={to.y}
                                    stroke="currentColor"
                                    strokeWidth="0.3"
                                    className="text-border"
                                    strokeDasharray="1 0.5"
                                />
                                {/* Animated pulse dot traveling along the line */}
                                <circle r="0.6" fill="currentColor" className="text-primary">
                                    <animateMotion
                                        dur={`${3 + i * 0.5}s`}
                                        repeatCount="indefinite"
                                        path={`M${from.x},${from.y} L${to.x},${to.y}`}
                                    />
                                </circle>
                                {link.label && (
                                    <text
                                        x={(from.x + to.x) / 2}
                                        y={(from.y + to.y) / 2 - 1}
                                        textAnchor="middle"
                                        fill="currentColor"
                                        className="text-muted-foreground"
                                        fontSize="1.8"
                                        fontFamily="monospace"
                                    >
                                        {link.label}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => (
                        <g
                            key={node.id}
                            onClick={() => setSelected(selected?.id === node.id ? null : node)}
                            className="cursor-pointer"
                        >
                            {/* Glow */}
                            <circle cx={node.x} cy={node.y} r="4" fill={node.color} opacity={0.1}>
                                <animate attributeName="r" values="3;4.5;3" dur="3s" repeatCount="indefinite" />
                            </circle>
                            {/* Main circle */}
                            <circle
                                cx={node.x} cy={node.y} r="3"
                                fill="var(--surface)"
                                stroke={node.color}
                                strokeWidth={selected?.id === node.id ? "0.6" : "0.3"}
                            />
                            {/* Emoji icon */}
                            <text x={node.x} y={node.y + 0.8} textAnchor="middle" fontSize="2.5">
                                {node.icon}
                            </text>
                            {/* Label */}
                            <text
                                x={node.x}
                                y={node.y + 5.5}
                                textAnchor="middle"
                                fill="currentColor"
                                className="text-foreground"
                                fontSize="1.8"
                                fontWeight="600"
                                fontFamily="Inter, sans-serif"
                            >
                                {node.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Selected Node Detail */}
            {selected && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 glass rounded-xl p-4 border border-border/50"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{selected.icon}</span>
                        <div>
                            <h4 className="font-bold text-foreground">{selected.label}</h4>
                            <p className="text-xs text-muted-foreground">{selected.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {selected.tech.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
