import React, { useState, useEffect } from 'react'
import { Brain, Sparkles, Save, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { Dream } from '../../types'

export default function DreamGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedDream, setGeneratedDream] = useState('')
  const [loading, setLoading] = useState(false)
  const [recentDreams, setRecentDreams] = useState<Dream[]>([])
  const [mode, setMode] = useState('standard')
  const [intensity, setIntensity] = useState(50)
  const { user } = useAuthStore()

  useEffect(() => {
    loadRecentDreams()
  }, [])

  const loadRecentDreams = async () => {
    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      if (data) {
        setRecentDreams(data)
      }
    } catch (error) {
      console.error('加载最近梦境失败:', error)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setTimeout(() => {
      setGeneratedDream(
        `基于提示词"${prompt}"生成的梦境：\n\n在一个充满神经元网络的虚拟空间中，意识流动形成了独特的图案。梦境中的每个元素都与大脑皮层的特定区域相连接，产生了奇妙的感知体验。这个梦境展现了人类潜意识与神经科学原理的完美结合。\n\n神经活动模式显示出高度同步的δ波和θ波，表明深度快速眼动（REM）睡眠状态。梦境的情感色调偏向${intensity > 60 ? '积极' : '中性'}，伴随着创造性思维的激发。\n\n生成模式：${mode}\n情感强度：${intensity}%`
      )
      setLoading(false)
    }, 2000)
  }

  const handleSave = async () => {
    if (!user || !generatedDream) {
      alert('请先登录后保存')
      return
    }

    try {
      const { error } = await supabase
        .from('dreams')
        .insert({
          user_id: user.id,
          title: prompt.substring(0, 50) || '未命名梦境',
          content: generatedDream,
          analysis: { mode, intensity, emotion: intensity > 60 ? '积极' : '中性' },
          tags: [mode, '生成'],
          is_public: true
        })

      if (error) throw error
      
      alert('梦境已保存！')
      loadRecentDreams()
    } catch (error) {
      console.error('保存梦境失败:', error)
      alert('保存失败，请重试')
    }
  }

  const handleDownload = () => {
    if (!generatedDream) return
    
    const blob = new Blob([generatedDream], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `梦境_${new Date().toISOString()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}天前`
    if (diffHours > 0) return `${diffHours}小时前`
    return '刚刚'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Brain className="text-blue-600" size={32} />
          梦境生成器
        </h1>
        <p className="text-gray-600 mt-2">
          利用神经网络技术生成逼真的梦境内容，探索潜意识的奥秘
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">生成配置</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                梦境提示词
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="输入梦境的主题、情感或场景..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生成模式
              </label>
              <select 
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">标准模式</option>
                <option value="creative">创意模式</option>
                <option value="scientific">科学模式</option>
                <option value="abstract">抽象模式</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                情感强度：{intensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>低</span>
                <span>中</span>
                <span>高</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  生成梦境
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">生成结果</h2>
            {generatedDream && (
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="保存梦境"
                >
                  <Save size={20} />
                </button>
                <button 
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="下载梦境"
                >
                  <Download size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[400px] p-4 bg-gray-50 rounded-lg">
            {generatedDream ? (
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {generatedDream}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>生成的梦境将在这里显示</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">最近生成的梦境</h2>
        {recentDreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDreams.map((dream) => (
              <div
                key={dream.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
              >
                <h3 className="font-medium text-gray-900 truncate">{dream.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{dream.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">{formatDate(dream.created_at)}</span>
                  {dream.analysis && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {dream.analysis.emotion || '未知'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            暂无公开梦境数据
          </div>
        )}
      </div>
    </div>
  )
}
