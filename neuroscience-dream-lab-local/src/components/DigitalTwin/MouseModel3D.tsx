// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Grid, Html } from '@react-three/drei'
import { Physics, useSphere, useBox } from '@react-three/cannon'
import * as THREE from 'three'

// 神经元组件（带实时活动）
function Neuron({ position, active }: { position: [number, number, number]; active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current && active) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3
      meshRef.current.scale.setScalar(scale)
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial 
        color={active ? '#22c55e' : '#64748b'} 
        emissive={active ? '#22c55e' : '#000000'}
        emissiveIntensity={active ? 0.8 : 0}
        metalness={0.2}
        roughness={0.4}
      />
    </mesh>
  )
}

// 小鼠身体组件（带物理引擎）
function MouseBody() {
  const [bodyRef, bodyApi] = useBox(() => ({
    mass: 1,
    position: [0, 0.5, 0],
    args: [0.6, 0.3, 1],
  }))

  const [headRef] = useSphere(() => ({
    mass: 0.5,
    position: [0, 0.5, 0.6],
    args: [0.25],
  }))

  const [hovered, setHovered] = useState(false)

  // 添加随机微小运动模拟呼吸
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const breathingForce = Math.sin(time * 2) * 0.001
    if (bodyApi && bodyApi.applyForce) {
      bodyApi.applyForce([0, breathingForce, 0], [0, 0, 0])
    }
  })

  return (
    <>
      {/* 身体 */}
      <mesh 
        ref={bodyRef as any} 
        castShadow 
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.6, 0.3, 1]} />
        <meshStandardMaterial 
          color={hovered ? "#a08870" : "#8b7355"} 
          metalness={0.1}
          roughness={0.8}
        />
        {hovered && (
          <Html position={[0, 0.3, 0]} center>
            <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs whitespace-nowrap">
              数字孪生小鼠 - 活动状态
            </div>
          </Html>
        )}
      </mesh>
      
      {/* 头部 */}
      <mesh ref={headRef as any} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color="#8b7355" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* 眼睛 */}
      <mesh position={[0.15, 0.55, 0.75]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.15, 0.55, 0.75]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* 鼻子 */}
      <mesh position={[0, 0.45, 0.85]} castShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>

      {/* 耳朵 */}
      <mesh position={[-0.18, 0.70, 0.65]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#a0826d" />
      </mesh>
      <mesh position={[0.18, 0.70, 0.65]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#a0826d" />
      </mesh>

      {/* 尾巴 */}
      <mesh position={[0, 0.4, -0.6]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      {/* 四肢 */}
      {/* 前腿 */}
      <mesh position={[0.2, 0.2, 0.3]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-0.2, 0.2, 0.3]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* 后腿 */}
      <mesh position={[0.2, 0.2, -0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-0.2, 0.2, -0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </>
  )
}

// 增强的神经网络可视化
function NeuralNetwork() {
  const [activeNeurons, setActiveNeurons] = useState<Set<number>>(new Set())
  const [connections, setConnections] = useState<Array<{from: number, to: number}>>([])

  useEffect(() => {
    // 生成神经元连接
    const newConnections = []
    for (let i = 0; i < 20; i++) {
      const numConnections = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numConnections; j++) {
        const targetIndex = Math.floor(Math.random() * 20)
        if (targetIndex !== i) {
          newConnections.push({ from: i, to: targetIndex })
        }
      }
    }
    setConnections(newConnections)

    // 定期更新活跃神经元
    const interval = setInterval(() => {
      const active = new Set<number>()
      const numActive = Math.floor(Math.random() * 8) + 4
      for (let i = 0; i < numActive; i++) {
        active.add(Math.floor(Math.random() * 20))
      }
      setActiveNeurons(active)
    }, 400)

    return () => clearInterval(interval)
  }, [])

  // 生成3D螺旋形神经元位置
  const neurons = Array.from({ length: 20 }, (_, i) => {
    const t = (i / 20) * Math.PI * 4
    const radius = 1.5 + Math.sin(t * 0.5) * 0.3
    return [
      Math.cos(t) * radius,
      0.5 + (i / 20) * 1.5 - 0.75,
      Math.sin(t) * radius
    ] as [number, number, number]
  })

  return (
    <group>
      {neurons.map((pos, i) => (
        <Neuron key={i} position={pos} active={activeNeurons.has(i)} />
      ))}
      
      {/* 连接线（仅显示活跃连接） */}
      {connections.map(({ from, to }, index) => {
        const isActive = activeNeurons.has(from) && activeNeurons.has(to)
        if (!isActive && Math.random() > 0.3) return null

        const points = [
          new THREE.Vector3(...neurons[from]),
          new THREE.Vector3(...neurons[to])
        ]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        
        return (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial 
              color={isActive ? '#22c55e' : '#475569'} 
              opacity={isActive ? 0.8 : 0.2}
              transparent
              linewidth={isActive ? 2 : 1}
            />
          </line>
        )
      })}
    </group>
  )
}

// 地面
function Ground() {
  const [ref] = useBox(() => ({
    position: [0, -0.5, 0],
    args: [15, 1, 15],
    type: 'Static',
  }))

  return (
    <mesh ref={ref as any} receiveShadow>
      <boxGeometry args={[15, 1, 15]} />
      <meshStandardMaterial 
        color="#1e293b" 
        opacity={0.9} 
        transparent 
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  )
}

// 互动区域指示器
function InteractionZone() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2, 2.2, 64]} />
      <meshBasicMaterial 
        color="#3b82f6" 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// 信息面板
function InfoPanel() {
  return (
    <Html position={[-3, 2, 0]} transform occlude>
      <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg" style={{ width: '250px' }}>
        <h3 className="font-bold mb-2 text-green-400">系统状态</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>神经活动:</span>
            <span className="text-green-400">活跃</span>
          </div>
          <div className="flex justify-between">
            <span>突触连接:</span>
            <span className="text-blue-400">71,234</span>
          </div>
          <div className="flex justify-between">
            <span>实时采样:</span>
            <span className="text-purple-400">60Hz</span>
          </div>
          <div className="flex justify-between">
            <span>物理引擎:</span>
            <span className="text-yellow-400">已启用</span>
          </div>
        </div>
      </div>
    </Html>
  )
}

// 主场景
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 3, 4]} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0.5, 0]}
      />
      
      {/* 光照 */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 3, -5]} intensity={0.8} color="#60a5fa" />
      <pointLight position={[5, 2, 5]} intensity={0.6} color="#a78bfa" />
      <spotLight 
        position={[0, 8, 0]} 
        intensity={0.5} 
        angle={0.6} 
        penumbra={1} 
        castShadow 
        color="#fbbf24"
      />

      {/* 物理世界 */}
      <Physics gravity={[0, -9.81, 0]} iterations={10}>
        <Ground />
        <MouseBody />
      </Physics>

      {/* 神经网络可视化 */}
      <NeuralNetwork />
      
      {/* 交互区域 */}
      <InteractionZone />
      
      {/* 信息面板 */}
      <InfoPanel />
      
      {/* 网格辅助 */}
      <Grid 
        infiniteGrid 
        fadeDistance={40} 
        fadeStrength={0.8}
        cellSize={0.6}
        cellThickness={0.6}
        sectionSize={3}
        sectionThickness={1.5}
        sectionColor="#3b82f6"
        cellColor="#475569"
        position={[0, 0, 0]}
      />

      {/* 环境贴图 */}
      <Environment preset="city" background={false} />
      
      {/* 雾效 */}
      <fog attach="fog" args={['#0f172a', 10, 50]} />
    </>
  )
}

// 主组件
export default function MouseModel3D() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#0f172a']} />
        <Scene />
      </Canvas>
    </div>
  )
}