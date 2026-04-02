"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

function Particles() {
    const pointsRef = useRef<THREE.Points>(null!)

    // Generate random particle positions once in state initializer
    const count = 800
    const [positions] = useState(() => {
        const arr = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 20
            arr[i * 3 + 1] = (Math.random() - 0.5) * 12
            arr[i * 3 + 2] = (Math.random() - 0.5) * 8
        }
        return arr
    })

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        pointsRef.current.rotation.y = t * 0.04
        pointsRef.current.rotation.x = Math.sin(t * 0.025) * 0.08
    })

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#FF5A36"
                size={0.04}
                sizeAttenuation
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    )
}

function GlowSphere({
    position,
    color,
    scale = 1,
}: {
    position: [number, number, number]
    color: string
    scale?: number
}) {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2
        meshRef.current.scale.setScalar(scale + Math.sin(t * 0.8) * 0.05)
    })

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>
    )
}

export function ThreeBackground() {
    return (
        <div className="three-canvas-container">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 60 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: false }}
                dpr={[1, 1.5]}
            >
                <Particles />
                <GlowSphere position={[-4, 2, -2]} color="#FF5A36" scale={1.2} />
                <GlowSphere position={[4, -1.5, -3]} color="#1D9E75" scale={1.0} />
                <GlowSphere position={[0, -3, -4]} color="#FF8C6B" scale={0.8} />
            </Canvas>
        </div>
    )
}
