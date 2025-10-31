import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface CreateExperimentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateExperimentModal({ open, onClose, onSuccess }: CreateExperimentModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'sleep_deprivation',
    description: '',
    hypothesis: '',
    variables: [''],
    duration: '',
    sample_size: '',
  })

  const experimentTypes = [
    { value: 'sleep_deprivation', label: '睡眠剥夺实验' },
    { value: 'dream_induction', label: '梦境诱导实验' },
    { value: 'neural_stimulation', label: '神经刺激实验' },
    { value: 'behavioral_analysis', label: '行为分析实验' },
    { value: 'memory_consolidation', label: '记忆巩固实验' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('请先登录')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('experiments')
        .insert({
          name: formData.name,
          type: formData.type,
          status: 'pending',
          config: {
            description: formData.description,
            hypothesis: formData.hypothesis,
            variables: formData.variables.filter(v => v.trim()),
            duration: formData.duration,
            sample_size: parseInt(formData.sample_size) || 0,
          },
          created_by: user.id,
        })

      if (error) throw error

      alert('实验创建成功！')
      onSuccess()
      onClose()
      
      // 重置表单
      setFormData({
        name: '',
        type: 'sleep_deprivation',
        description: '',
        hypothesis: '',
        variables: [''],
        duration: '',
        sample_size: '',
      })
    } catch (error) {
      console.error('创建实验失败:', error)
      alert('创建实验失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const addVariable = () => {
    setFormData(prev => ({
      ...prev,
      variables: [...prev.variables, '']
    }))
  }

  const removeVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }))
  }

  const updateVariable = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.map((v, i) => i === index ? value : v)
    }))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">创建新实验</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 实验名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              实验名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="例如：REM睡眠与记忆巩固关系研究"
            />
          </div>

          {/* 实验类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              实验类型 *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {experimentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 实验描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              实验描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="简要描述实验目的和方法..."
            />
          </div>

          {/* 研究假设 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              研究假设
            </label>
            <textarea
              value={formData.hypothesis}
              onChange={(e) => setFormData(prev => ({ ...prev, hypothesis: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="描述您的研究假设..."
            />
          </div>

          {/* 实验变量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              实验变量
            </label>
            <div className="space-y-2">
              {formData.variables.map((variable, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={variable}
                    onChange={(e) => updateVariable(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`变量 ${index + 1}`}
                  />
                  {formData.variables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariable(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addVariable}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Plus size={20} />
                添加变量
              </button>
            </div>
          </div>

          {/* 实验时长和样本大小 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                预计时长
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="例如：2周"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                样本大小
              </label>
              <input
                type="number"
                value={formData.sample_size}
                onChange={(e) => setFormData(prev => ({ ...prev, sample_size: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="例如：50"
                min="1"
              />
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '创建中...' : '创建实验'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
