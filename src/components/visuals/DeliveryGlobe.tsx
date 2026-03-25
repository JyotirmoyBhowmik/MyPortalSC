"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

function Arc({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
    const curve = useMemo(() => {
        const mid = [
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2 + 1.5, // curve up
            (start[2] + end[2]) / 2
        ] as [number, number, number];
        return new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(...start),
            new THREE.Vector3(...mid),
            new THREE.Vector3(...end)
        );
    }, [start, end]);

    const points = useMemo(() => curve.getPoints(50), [curve]);

    return (
        <group>
            {/* The Arc Line */}
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial attach="material" color="#64ffda" opacity={0.6} transparent linewidth={2} />
            </line>
            
            {/* Start Node */}
            <mesh position={new THREE.Vector3(...start)}>
                <Sphere args={[0.04, 16, 16]}>
                    <meshBasicMaterial color="#00ff41" transparent opacity={0.9} />
                </Sphere>
            </mesh>
            
            {/* End Node */}
            <mesh position={new THREE.Vector3(...end)}>
                <Sphere args={[0.04, 16, 16]}>
                    <meshBasicMaterial color="#00ff41" transparent opacity={0.9} />
                </Sphere>
            </mesh>
        </group>
    );
}

function Earth() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <mesh ref={meshRef}>
            <Sphere args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#00ff41" // neon green
                    emissive="#00ff41"
                    emissiveIntensity={0.6}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </Sphere>
            {/* Inner solid core to block lines behind */}
            <Sphere args={[1.98, 64, 64]}>
                <meshBasicMaterial color="#050505" />
            </Sphere>
        </mesh>
    );
}

export default function DeliveryGlobe() {
    // Random arcs for demo "global reach"
    const arcs = useMemo(() => {
        const items = [];
        for (let i = 0; i < 8; i++) {
            // random points on sphere surface
            const theta1 = Math.random() * Math.PI * 2;
            const phi1 = Math.acos((Math.random() * 2) - 1);
            const r = 2;
            const x1 = r * Math.sin(phi1) * Math.cos(theta1);
            const y1 = r * Math.sin(phi1) * Math.sin(theta1);
            const z1 = r * Math.cos(phi1);

            const theta2 = Math.random() * Math.PI * 2;
            const phi2 = Math.acos((Math.random() * 2) - 1);
            const x2 = r * Math.sin(phi2) * Math.cos(theta2);
            const y2 = r * Math.sin(phi2) * Math.sin(theta2);
            const z2 = r * Math.cos(phi2);

            items.push({ start: [x1, y1, z1] as [number, number, number], end: [x2, y2, z2] as [number, number, number] });
        }
        return items;
    }, []);


    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-black relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <group rotation={[0.2, 0, 0]}> {/* Tilt */}
                    <Earth />
                    <group rotation-y={0}>
                        {/* We can rotate arcs with earth if we put them inside Earth component or reference same rotation. 
                             For simplicity, let's just render static arcs that don't rotate with the wireframe to simulate "connections" across the static globe space, 
                             or make them rotate. Let's make them rotate.
                         */}
                        {/* Actually, let's keep arcs static for visual clarity or rotate them slowly. 
                             If I put them here, they are static relative to container.
                         */}
                        {arcs.map((arc, i) => (
                            <Arc key={i} start={arc.start} end={arc.end} />
                        ))}
                    </group>
                </group>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
            <div className="absolute bottom-4 left-4 z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white/80">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Operations
                </div>
            </div>
        </div>
    );
}
