import React, { useState } from 'react'
import { MessageSquare, Users, FileText, TrendingUp, Download, Sparkles } from 'lucide-react'
import ChatInterface from '../../components/AISalon/ChatInterface'

export default function AISalon() {
  const [activeTab, setActiveTab] = useState<'chat' | 'reports'>('chat')

  const reports = [
    { 
      id: '1',
      title: 'REM睡眠与神经可塑性研究报告', 
      date: '2024-10-30', 
      pages: 15,
      quality: 95,
      summary: '深入探讨了快速眼动睡眠期间大脑神经可塑性的变化机制...'
    },
    { 
      id: '2',
      title: '梦境内容分析方法论综述', 
      date: '2024-10-29', 
      pages: 22,
      quality: 92,
      summary: '系统性地总结了当前主流的梦境内容分析方法和技术...'
    },
    { 
      id: '3',
      title: '数字孪生模型在神经科学中的应用', 
      date: '2024-10-28', 
      pages: 18,
      quality: 88,
      summary: '评估了数字孪生技术在神经科学研究中的潜力和挑战...'
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MessageSquare className="text-pink-600" size={32} />
          AI知识沙龙
        </h1>
        <p className="text-gray-600 mt-2">
          多智能体协作对话系统，自动提取知识并生成研究报告
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">活跃智能体</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">对话轮次</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">生成报告</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-pink-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">平均质量</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                对话交流
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={18} />
                研究报告
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'chat' ? (
            <div className="h-[600px]">
              <ChatInterface />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">生成的研究报告</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Sparkles size={18} />
                  生成新报告
                </button>
              </div>

              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="p-6 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{report.summary}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          日期：{report.date}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                          {report.pages}页
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          质量：{report.quality}分
                        </span>
                      </div>
                    </div>
                    <button className="ml-4 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              ))}

              {reports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">暂无研究报告</p>
                  <p className="text-sm text-gray-400 mt-2">
                    开始对话后，系统将自动生成研究报告
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 功能说明 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="text-purple-600" />
          AI沙龙功能特点
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">多智能体协作</h4>
            <p className="text-sm text-gray-600">
              神经科学专家、梦境分析师、数据科学家等多个AI智能体协同工作
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">知识提取</h4>
            <p className="text-sm text-gray-600">
              自动从对话中提取关键见解和研究发现
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">报告生成</h4>
            <p className="text-sm text-gray-600">
              基于讨论内容自动生成结构化的研究报告
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
