import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import type { Mesh } from 'three'

function RotatingShape({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return
    ref.current.rotation.x += delta * 0.15
    ref.current.rotation.y += delta * 0.22
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.12, 0]} />
      <meshStandardMaterial
        color="#9cb4ff"
        metalness={0.72}
        roughness={0.22}
        emissive="#1e2440"
        emissiveIntensity={0.35}
      />
    </mesh>
  )
}

export default function HeroScene({
  reducedMotion,
}: {
  reducedMotion: boolean
}) {
  const maxDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1

  return (
    <Canvas
      dpr={[1, maxDpr]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
      className="h-full w-full touch-none"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 3.6]} fov={45} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 3, 6]} intensity={1.15} />
      <pointLight position={[-4, -2, 3]} intensity={0.55} color="#c4b5fd" />
      <RotatingShape reducedMotion={reducedMotion} />
      {!reducedMotion ? (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.75}
          minPolarAngle={Math.PI / 3.2}
        />
      ) : null}
    </Canvas>
  )
}
