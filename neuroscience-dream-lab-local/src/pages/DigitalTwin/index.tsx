import React, { useState, useEffect } from 'react'
import { Mouse, Play, Pause, RotateCcw, Activity } from 'lucide-react'
import MouseModel3D from '../../components/DigitalTwin/MouseModel3D'
import NeuralActivity from '../../components/DigitalTwin/NeuralActivity'

export default function DigitalTwin() {
  const [isRunning, setIsRunning] = useState(true)
  const [stats, setStats] = useState({
    neuronCount: 71234,
    activeConnections: 8532,
    simulationSpeed: 1.0,
    runTime: 0
  })

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        neuronCount: 71234 + Math.floor(Math.random() * 100),
        activeConnections: 8532 + Math.floor(Math.random() * 50),
        runTime: prev.runTime + 1
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const formatRunTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const behaviorMetrics = [
    { name: '活动水平', value: 78, color: 'bg-blue-600' },
    { name: '探索行为', value: 65, color: 'bg-green-600' },
    { name: '社交互动', value: 82, color: 'bg-purple-600' },
    { name: '学习能力', value: 91, color: 'bg-pink-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Mouse className="text-green-600" size={32} />
          数字孪生小鼠仿真
        </h1>
        <p className="text-gray-600 mt-2">
          高精度虚拟小鼠模型，实时模拟神经活动和行为模式
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">仿真状态</p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <p className="text-2xl font-bold text-gray-900">{isRunning ? '运行中' : '已暂停'}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">神经元数量</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.neuronCount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">活跃连接</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeConnections.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">运行时间</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatRunTime(stats.runTime)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" />
            3D仿真视图
          </h2>
          <div className="flex gap-2">
            {isRunning ? (
              <button 
                onClick={() => setIsRunning(false)}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="暂停"
              >
                <Pause size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setIsRunning(true)}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="运行"
              >
                <Play size={20} />
              </button>
            )}
            <button 
              onClick={() => setStats(prev => ({ ...prev, runTime: 0 }))}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="重置"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <MouseModel3D />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>操作说明：</strong> 鼠标左键拖动旋转视角，滚轮缩放，右键拖动平移。绿色闪烁的神经元表示活跃状态。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">行为指标</h2>
          <div className="space-y-4">
            {behaviorMetrics.map((metric) => (
              <div key={metric.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${metric.color} h-2.5 rounded-full transition-all duration-300`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>综合评分：</strong> 
              <span className="text-lg font-bold text-green-600 ml-2">79分</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              基于多维度行为分析的综合评估结果
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-green-600" />
            神经活动记录
          </h2>
          <div className="h-64 bg-gray-50 rounded-lg p-2">
            <NeuralActivity />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">前额叶皮层</p>
              <p className="text-lg font-bold text-blue-600">68%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600">海马体</p>
              <p className="text-lg font-bold text-green-600">82%</p>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <p className="text-xs text-gray-600">杏仁核</p>
              <p className="text-lg font-bold text-pink-600">75%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
