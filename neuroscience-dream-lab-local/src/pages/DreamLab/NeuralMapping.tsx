// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Network, Zap, Activity, Play, Square } from 'lucide-react'

// 神经元节点组件
function NeuronNode({ position, active, label }: { position: [number, number, number]; active: boolean; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current && active) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.25
      meshRef.current.scale.setScalar(scale)
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1)
    }
  })

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color={active ? '#22c55e' : '#64748b'} 
          emissive={active ? '#10b981' : '#1e293b'}
          emissiveIntensity={active ? 0.8 : 0.3}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {(hovered || active) && (
        <Html position={[0, 0.3, 0]} center>
          <div className="bg-black bg-opacity-80 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap pointer-events-none">
            {label}
            {active && <span className="ml-2 text-green-400">● 活跃</span>}
          </div>
        </Html>
      )}
    </group>
  )
}

// 神经连接线组件
function NeuralConnection({ start, end, active }: { start: [number, number, number]; end: [number, number, number]; active: boolean }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  
  return (
    <Line
      points={points}
      color={active ? '#22c55e' : '#475569'}
      lineWidth={active ? 3 : 1.5}
      transparent
      opacity={active ? 0.8 : 0.3}
    />
  )
}

// 脑电波可视化
function BrainWaves() {
  const groupRef = useRef<THREE.Group>(null!)
  const [waveData, setWaveData] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = Array.from({ length: 50 }, () => Math.random() * 2 - 1)
      setWaveData(newData)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {waveData.map((value, i) => (
        <mesh key={i} position={[(i - 25) * 0.12, value * 0.5, 0]}>
          <boxGeometry args={[0.08, Math.abs(value) * 0.8, 0.08]} />
          <meshStandardMaterial 
            color={value > 0 ? '#3b82f6' : '#8b5cf6'} 
            emissive={value > 0 ? '#2563eb' : '#7c3aed'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

// 3D神经网络场景
function NeuralNetworkScene({ isMapping }: { isMapping: boolean }) {
  const [activeNeurons, setActiveNeurons] = useState<Set<number>>(new Set())

  // 定义脑区和神经元位置
  const brainRegions = [
    // 前额叶皮层 (Prefrontal Cortex)
    { id: 0, label: '前额叶皮层', position: [0, 1.5, 2] as [number, number, number] },
    { id: 1, label: '前额叶', position: [-0.8, 1.3, 1.8] as [number, number, number] },
    { id: 2, label: '前额叶', position: [0.8, 1.3, 1.8] as [number, number, number] },
    
    // 海马体 (Hippocampus)
    { id: 3, label: '海马体', position: [-1.2, 0, 0] as [number, number, number] },
    { id: 4, label: '海马体', position: [1.2, 0, 0] as [number, number, number] },
    
    // 杏仁核 (Amygdala)
    { id: 5, label: '杏仁核', position: [-1, -0.5, 0.5] as [number, number, number] },
    { id: 6, label: '杏仁核', position: [1, -0.5, 0.5] as [number, number, number] },
    
    // 视觉皮层 (Visual Cortex)
    { id: 7, label: '视觉皮层', position: [0, 1, -2] as [number, number, number] },
    { id: 8, label: '视觉皮层', position: [-0.7, 0.8, -1.8] as [number, number, number] },
    { id: 9, label: '视觉皮层', position: [0.7, 0.8, -1.8] as [number, number, number] },
    
    // 运动皮层 (Motor Cortex)
    { id: 10, label: '运动皮层', position: [-1.5, 1.2, 0] as [number, number, number] },
    { id: 11, label: '运动皮层', position: [1.5, 1.2, 0] as [number, number, number] },
    
    // 丘脑 (Thalamus)
    { id: 12, label: '丘脑', position: [0, 0, 0] as [number, number, number] },
  ]

  // 定义神经连接
  const connections = [
    // 前额叶与海马体连接
    { from: 0, to: 3 }, { from: 0, to: 4 }, { from: 1, to: 3 }, { from: 2, to: 4 },
    // 海马体与杏仁核连接
    { from: 3, to: 5 }, { from: 4, to: 6 },
    // 视觉皮层连接
    { from: 7, to: 12 }, { from: 8, to: 12 }, { from: 9, to: 12 },
    // 丘脑连接
    { from: 12, to: 0 }, { from: 12, to: 3 }, { from: 12, to: 4 },
    // 运动皮层连接
    { from: 10, to: 12 }, { from: 11, to: 12 },
    // 前额叶与视觉皮层
    { from: 0, to: 7 }, { from: 1, to: 8 }, { from: 2, to: 9 },
    // 额外连接
    { from: 5, to: 0 }, { from: 6, to: 0 }, { from: 10, to: 3 }, { from: 11, to: 4 },
  ]

  useEffect(() => {
    if (!isMapping) {
      setActiveNeurons(new Set())
      return
    }

    // 神经活动传播模拟
    const interval = setInterval(() => {
      const active = new Set<number>()
      const numActive = Math.floor(Math.random() * 6) + 4
      
      // 随机激活一些神经元
      for (let i = 0; i < numActive; i++) {
        active.add(Math.floor(Math.random() * brainRegions.length))
      }
      
      setActiveNeurons(active)
    }, 300)

    return () => clearInterval(interval)
  }, [isMapping])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={12}
        target={[0, 0.5, 0]}
      />
      
      {/* 照明 */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.6} color="#60a5fa" />
      <pointLight position={[5, 3, 5]} intensity={0.6} color="#a78bfa" />
      <spotLight position={[0, 6, 0]} intensity={0.4} angle={0.5} penumbra={1} color="#fbbf24" />

      {/* 神经元节点 */}
      {brainRegions.map((region) => (
        <NeuronNode
          key={region.id}
          position={region.position}
          active={activeNeurons.has(region.id)}
          label={region.label}
        />
      ))}

      {/* 神经连接 */}
      {connections.map((conn, idx) => {
        const isActive = activeNeurons.has(conn.from) && activeNeurons.has(conn.to)
        return (
          <NeuralConnection
            key={idx}
            start={brainRegions[conn.from].position}
            end={brainRegions[conn.to].position}
            active={isActive}
          />
        )
      })}

      {/* 脑电波可视化 */}
      {isMapping && <BrainWaves />}

      {/* 中心球体（大脑核心） */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#1e40af" 
          transparent 
          opacity={0.3}
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 环境 */}
      <fog attach="fog" args={['#0f172a', 8, 20]} />
      <color attach="background" args={['#0f172a']} />
    </>
  )
}

// 主组件
export default function NeuralMapping() {
  const [isMapping, setIsMapping] = useState(false)
  const [stats, setStats] = useState({
    neuralActivity: 85,
    brainwaveFrequency: 8.5,
    connectionStrength: 92,
  })

  useEffect(() => {
    if (!isMapping) return

    // 实时更新统计数据
    const interval = setInterval(() => {
      setStats({
        neuralActivity: Math.floor(Math.random() * 20) + 75,
        brainwaveFrequency: (Math.random() * 4 + 6).toFixed(1) as any,
        connectionStrength: Math.floor(Math.random() * 15) + 85,
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isMapping])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Network className="text-purple-600" size={32} />
          神经映射
        </h1>
        <p className="text-gray-600 mt-2">
          实时监控和分析梦境过程中的神经活动模式
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">神经活动</p>
              <p className="text-2xl font-bold text-gray-900">{stats.neuralActivity}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${stats.neuralActivity}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">脑波频率</p>
              <p className="text-2xl font-bold text-gray-900">{stats.brainwaveFrequency} Hz</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">θ波 (Theta)</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Network size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">连接强度</p>
              <p className="text-2xl font-bold text-gray-900">{stats.connectionStrength}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${stats.connectionStrength}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3D神经网络可视化 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">实时神经网络可视化</h2>
          <button
            onClick={() => setIsMapping(!isMapping)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all ${
              isMapping 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isMapping ? (
              <>
                <Square size={18} />
                停止映射
              </>
            ) : (
              <>
                <Play size={18} />
                开始映射
              </>
            )}
          </button>
        </div>
        
        <div className="relative" style={{ height: '600px' }}>
          <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
            <NeuralNetworkScene isMapping={isMapping} />
          </Canvas>
          
          {!isMapping && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-black bg-opacity-50 p-8 rounded-xl">
                <Network size={64} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 font-medium text-lg">
                  点击"开始映射"查看实时神经网络活动
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 脑区活动和神经递质 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">脑区活动</h2>
          <div className="space-y-4">
            {[
              { region: '前额叶皮层', activity: 78, color: 'bg-blue-500' },
              { region: '海马体', activity: 92, color: 'bg-purple-500' },
              { region: '杏仁核', activity: 65, color: 'bg-pink-500' },
              { region: '视觉皮层', activity: 88, color: 'bg-green-500' },
              { region: '运动皮层', activity: 45, color: 'bg-yellow-500' },
            ].map((item) => (
              <div key={item.region}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.region}</span>
                  <span className="text-sm font-medium text-gray-900">{item.activity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.activity}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">神经递质水平</h2>
          <div className="space-y-4">
            {[
              { name: '多巴胺 (Dopamine)', level: 85, color: 'bg-blue-500' },
              { name: '血清素 (Serotonin)', level: 72, color: 'bg-purple-500' },
              { name: '乙酰胆碱 (Acetylcholine)', level: 90, color: 'bg-green-500' },
              { name: 'GABA', level: 68, color: 'bg-yellow-500' },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">{item.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
