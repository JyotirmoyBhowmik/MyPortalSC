"use client";

import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Define locations to plot (e.g., Kathmandu, Delhi, Singapore, Dubai, London, New York)
const markers = [
  { name: "Kathmandu", coordinates: [85.324, 27.7172] as [number, number] },
  { name: "Delhi", coordinates: [77.209, 28.6139] as [number, number] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] as [number, number] },
  { name: "Dubai", coordinates: [55.2708, 25.2048] as [number, number] },
  { name: "London", coordinates: [-0.1276, 51.5074] as [number, number] },
  { name: "New York", coordinates: [-74.006, 40.7128] as [number, number] },
];

const WorldMap = () => {
    return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center relative" style={{ backgroundColor: '#000000' }}>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 120,
                    center: [20, 30] // Centers near Middle East / South Asia
                }}
                className="w-full h-full"
                style={{ backgroundColor: '#000000' }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#0a0a0a"
                                stroke="#1a1a1a"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#1a1a1a", outline: "none" },
                                    pressed: { outline: "none" }
                                }}
                            />
                        ))
                    }
                </Geographies>

                {/* Draw connection lines from Kathmandu to other nodes */}
                {markers.map((marker, idx) => {
                    if (marker.name === "Kathmandu") return null;
                    return (
                        <Line
                            key={`line-${idx}`}
                            from={markers[0].coordinates} // Kathmandu
                            to={marker.coordinates}
                            stroke="#64ffda"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            style={{
                                strokeDasharray: "4 4",
                                animation: "dash 10s linear infinite"
                            }}
                        />
                    );
                })}

                {/* Plot the glowing markers */}
                {markers.map(({ name, coordinates }) => (
                    <Marker key={name} coordinates={coordinates}>
                        <circle r={4} fill="#00ff41" className="animate-pulse" />
                        <circle r={12} fill="#00ff41" opacity={0.2} className="animate-ping" />
                    </Marker>
                ))}
            </ComposableMap>
            
            <style jsx>{`
                @keyframes dash {
                    to { stroke-dashoffset: -100; }
                }
            `}</style>

            {/* Overlay label */}
            <div className="absolute bottom-4 left-4 z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
                    Active Global Footprint
                </div>
            </div>
        </div>
    );
};

export default memo(WorldMap);
