import React, { useEffect, useState } from 'react'
import { FlaskConical, PlayCircle, CheckCircle, XCircle, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Experiment } from '../../types'
import CreateExperimentModal from '../../components/Experiments/CreateExperimentModal'

export default function Experiments() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [stats, setStats] = useState({
    running: 0,
    completed: 0,
    failed: 0,
    pending: 0
  })

  useEffect(() => {
    loadData()

    // 订阅实时更新
    const subscription = supabase
      .channel('experiments_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'experiments' },
        () => loadData()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setExperiments(data)
        
        // 计算统计数据
        setStats({
          running: data.filter(e => e.status === 'running').length,
          completed: data.filter(e => e.status === 'completed').length,
          failed: data.filter(e => e.status === 'failed').length,
          pending: data.filter(e => e.status === 'pending').length
        })
      }
    } catch (error) {
      console.error('加载实验失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'running': return '运行中'
      case 'failed': return '失败'
      default: return '待处理'
    }
  }

  const getProgress = (status: string) => {
    switch (status) {
      case 'completed': return 100
      case 'running': return 50
      case 'failed': return 0
      default: return 0
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FlaskConical className="text-purple-600" size={32} />
          自动化实验系统
        </h1>
        <p className="text-gray-600 mt-2">
          智能实验设计、自动执行和结果分析
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <PlayCircle className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">运行中</p>
              <p className="text-2xl font-bold text-gray-900">{stats.running}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">失败</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <FlaskConical className="text-purple-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">待处理</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">实验列表</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            创建新实验
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">类型</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">进度</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {experiments.length > 0 ? (
                experiments.map((exp) => (
                  <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-900 font-mono">
                      {exp.id.substring(0, 8)}...
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                      {exp.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {exp.type}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(exp.status)}`}>
                        {getStatusText(exp.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${getProgress(exp.status)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(exp.created_at).toLocaleString('zh-CN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <FlaskConical className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">暂无实验数据</p>
                    <p className="text-sm text-gray-400 mt-2">
                      点击上方按钮创建您的第一个实验
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建实验模态框 */}
      <CreateExperimentModal 
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadData}
      />
    </div>
  )
}
