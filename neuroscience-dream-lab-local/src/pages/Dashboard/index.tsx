import React, { useEffect, useState } from 'react'
import { 
  Activity, 
  Brain, 
  Mouse, 
  FlaskConical, 
  MessageSquare, 
  Network, 
  Settings,
  TrendingUp,
  Clock
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { SystemStatus, Experiment } from '../../types'

interface ModuleStatus {
  name: string
  icon: any
  status: string
  color: string
  metrics?: any
}

export default function Dashboard() {
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeExperiments: 0,
    dreamsAnalyzed: 0,
    digitalTwinSessions: 0,
    aiDialogues: 0
  })

  useEffect(() => {
    loadData()
    
    // 订阅实时更新
    const statusSubscription = supabase
      .channel('system_status_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'system_status' }, 
        () => loadSystemStatus()
      )
      .subscribe()

    const experimentsSubscription = supabase
      .channel('experiments_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'experiments' },
        () => loadExperiments()
      )
      .subscribe()

    return () => {
      statusSubscription.unsubscribe()
      experimentsSubscription.unsubscribe()
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadSystemStatus(),
        loadExperiments(),
        loadStats()
      ])
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSystemStatus = async () => {
    const { data, error } = await supabase
      .from('system_status')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('加载系统状态失败:', error)
      return
    }
    
    if (data) {
      setSystemStatuses(data)
    }
  }

  const loadExperiments = async () => {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('加载实验失败:', error)
      return
    }
    
    if (data) {
      setExperiments(data)
    }
  }

  const loadStats = async () => {
    try {
      // 获取活跃实验数
      const { count: experimentsCount } = await supabase
        .from('experiments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'running')

      // 获取梦境分析数
      const { count: dreamsCount } = await supabase
        .from('dreams')
        .select('*', { count: 'exact', head: true })

      // 获取数字孪生会话数
      const { count: sessionsCount } = await supabase
        .from('digital_twin_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      setStats({
        activeExperiments: experimentsCount || 0,
        dreamsAnalyzed: dreamsCount || 0,
        digitalTwinSessions: sessionsCount || 0,
        aiDialogues: 45 // 暂时硬编码，后续可以从AI沙龙模块获取
      })
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  }

  const modules: ModuleStatus[] = [
    { 
      name: '梦境实验室', 
      icon: Brain, 
      status: systemStatuses.find(s => s.module_name === 'dreamlab')?.status || 'online',
      color: 'bg-blue-500' 
    },
    { 
      name: '数字孪生', 
      icon: Mouse, 
      status: systemStatuses.find(s => s.module_name === 'digital_twin')?.status || 'online',
      color: 'bg-green-500' 
    },
    { 
      name: '实验系统', 
      icon: FlaskConical, 
      status: systemStatuses.find(s => s.module_name === 'experiments')?.status || 'online',
      color: 'bg-purple-500' 
    },
    { 
      name: 'AI沙龙', 
      icon: MessageSquare, 
      status: systemStatuses.find(s => s.module_name === 'ai_salon')?.status || 'online',
      color: 'bg-pink-500' 
    },
    { 
      name: '集成系统', 
      icon: Network, 
      status: systemStatuses.find(s => s.module_name === 'integration')?.status || 'online',
      color: 'bg-yellow-500' 
    },
    { 
      name: '管理系统', 
      icon: Settings, 
      status: systemStatuses.find(s => s.module_name === 'admin')?.status || 'online',
      color: 'bg-gray-500' 
    },
  ]

  const statsData = [
    { name: '活跃实验', value: stats.activeExperiments.toString(), change: '+8%', icon: FlaskConical },
    { name: '梦境分析', value: stats.dreamsAnalyzed.toString(), change: '+23%', icon: Brain },
    { name: '数字孪生会话', value: stats.digitalTwinSessions.toString(), change: '+12%', icon: Mouse },
    { name: 'AI对话', value: stats.aiDialogues.toString(), change: '+15%', icon: MessageSquare },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">系统仪表板</h1>
        <p className="text-gray-600 mt-2">神经梦境实验室统一管理平台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-2">{stat.change}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <stat.icon size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={24} />
            系统模块状态
          </h2>
          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${module.color} rounded-lg`}>
                    <module.icon size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{module.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    module.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {module.status === 'online' ? '运行中' : '离线'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={24} />
            实时活动
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Brain size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  新的梦境分析完成
                </p>
                <p className="text-xs text-gray-600 mt-1">5分钟前</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <Mouse size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  数字孪生仿真启动
                </p>
                <p className="text-xs text-gray-600 mt-1">12分钟前</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-500 rounded-lg">
                <FlaskConical size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  实验运行完成
                </p>
                <p className="text-xs text-gray-600 mt-1">25分钟前</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg">
              <div className="p-2 bg-pink-500 rounded-lg">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  AI沙龙生成新报告
                </p>
                <p className="text-xs text-gray-600 mt-1">1小时前</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={24} />
          最近实验
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  实验ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  名称
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  类型
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  状态
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  时间
                </th>
              </tr>
            </thead>
            <tbody>
              {experiments.length > 0 ? (
                experiments.map((exp) => (
                  <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {exp.id.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{exp.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{exp.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          exp.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : exp.status === 'running'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {exp.status === 'completed' ? '完成' : exp.status === 'running' ? '运行中' : '待处理'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(exp.created_at).toLocaleString('zh-CN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    暂无实验数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
