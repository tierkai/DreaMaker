import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Sparkles, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agent?: string
  timestamp: Date
}

interface Agent {
  name: string
  role: string
  color: string
  icon: string
}

const agents: Agent[] = [
  { name: '神经科学专家', role: 'neuroscientist', color: 'bg-blue-500', icon: '🧠' },
  { name: '梦境分析师', role: 'dream_analyst', color: 'bg-purple-500', icon: '💭' },
  { name: '数据科学家', role: 'data_scientist', color: 'bg-green-500', icon: '📊' },
  { name: '实验设计师', role: 'experiment_designer', color: 'bg-pink-500', icon: '🔬' },
]

export default function ChatInterface() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: '欢迎来到AI知识沙龙！这里汇集了多位AI专家，他们将共同探讨神经科学和梦境研究的前沿话题。',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set())
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 初始化对话
  useEffect(() => {
    if (user && !conversationId) {
      createConversation()
    }
  }, [user])

  const createConversation = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('ai_salon_conversations')
        .insert({
          user_id: user.id,
          title: '新对话',
          topic: '神经科学与梦境研究',
          status: 'active'
        })
        .select()
        .maybeSingle()

      if (error) throw error
      if (data) {
        setConversationId(data.id)
      }
    } catch (error) {
      console.error('创建对话失败:', error)
    }
  }

  const simulateAgentResponse = async (userMessage: string) => {
    // 模拟多智能体响应（当API密钥不可用时使用）
    const respondingAgents = agents.filter(() => Math.random() > 0.4)
    
    // 确保至少有一个智能体响应
    if (respondingAgents.length === 0) {
      respondingAgents.push(agents[Math.floor(Math.random() * agents.length)])
    }
    
    for (const agent of respondingAgents) {
      setActiveAgents(prev => new Set([...prev, agent.role]))
      
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const responses = {
        neuroscientist: [
          '从神经科学的角度来看，这个问题涉及到大脑的可塑性机制。最新研究表明，REM睡眠期间海马体与新皮层之间的神经连接会显著增强。',
          '神经元之间的突触连接在REM睡眠期间会发生显著变化，这个过程被称为突触可塑性，对记忆巩固至关重要。',
          '海马体在记忆巩固过程中起着关键作用，尤其是在睡眠状态下，它会重放白天的神经活动模式。'
        ],
        dream_analyst: [
          '梦境内容往往反映了潜意识中的心理活动。根据荣格的理论，梦境中的符号可以帮助我们理解内心的冲突和需求。',
          '这种梦境模式在临床实践中经常出现，通常与情绪处理和心理整合有关。梦境为我们提供了一个安全的空间来处理困难的情感。',
          '从象征主义的角度分析，这可能代表着内心的某种冲突。不同的梦境元素往往对应着我们日常生活中的不同压力源。'
        ],
        data_scientist: [
          '通过对大量梦境数据的分析，我们发现了一些有趣的统计规律。例如，85%的REM睡眠梦境包含情感内容，而NREM梦境这个比例只有60%。',
          '机器学习模型可以识别出梦境内容与神经活动之间的相关性。我们的模型准确率已经达到了78%，可以根据脑电图预测梦境主题。',
          '数据显示，不同睡眠阶段的神经活动模式存在显著差异。Delta波主导的深睡眠和Theta波主导的REM睡眠显示出完全不同的网络连接模式。'
        ],
        experiment_designer: [
          '我们可以设计一个对照实验来验证这个假设。建议采用随机分组，一组进行睡眠剥夺，一组作为对照，然后比较两组的梦境报告。',
          '实验设计需要考虑多个变量，包括环境因素和个体差异。建议使用标准化的睡眠实验室环境，并控制光照、温度和噪音。',
          '建议采用双盲实验方法，以确保结果的可靠性。数据收集人员不应该知道被试属于哪个实验组，这样可以避免观察者偏差。'
        ]
      }

      const agentResponses = responses[agent.role as keyof typeof responses]
      const response = agentResponses[Math.floor(Math.random() * agentResponses.length)]

      const newMessage: Message = {
        id: Date.now().toString() + agent.role,
        role: 'assistant',
        content: response,
        agent: agent.name,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newMessage])
      
      // 保存到数据库
      if (conversationId && user) {
        await supabase
          .from('ai_salon_messages')
          .insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: response,
            agent_name: agent.name,
            agent_role: agent.role
          })
      }
      
      setActiveAgents(prev => {
        const next = new Set(prev)
        next.delete(agent.role)
        return next
      })
    }
  }

  const callRealAPI = async (userMessage: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-salon-chat', {
        body: {
          conversationId,
          userMessage,
          userId: user?.id
        }
      })

      if (error) throw error

      if (data?.data?.responses) {
        for (const response of data.data.responses) {
          const newMessage: Message = {
            id: Date.now().toString() + response.agentRole,
            role: 'assistant',
            content: response.content,
            agent: response.agentName,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, newMessage])
        }
        return true
      }
      return false
    } catch (error: any) {
      console.error('API调用失败:', error)
      // 如果是API密钥未配置的错误，标记API不可用
      if (error.message?.includes('API密钥') || error.message?.includes('LLM')) {
        setApiAvailable(false)
      }
      return false
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    if (!user) {
      alert('请先登录')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    
    // 保存用户消息到数据库
    if (conversationId) {
      await supabase
        .from('ai_salon_messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          content: input
        })
    }
    
    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      // 首次尝试调用真实API（如果还没确定API是否可用）
      if (apiAvailable !== false) {
        const apiSuccess = await callRealAPI(currentInput)
        if (apiSuccess) {
          setApiAvailable(true)
        } else if (apiAvailable === null) {
          // 首次失败，回退到模拟
          await simulateAgentResponse(currentInput)
        }
      } else {
        // API已知不可用，直接使用模拟
        await simulateAgentResponse(currentInput)
      }
    } catch (error) {
      console.error('Error:', error)
      // 出错时回退到模拟
      await simulateAgentResponse(currentInput)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* API状态提示 */}
      {apiAvailable === false && (
        <div className="p-3 bg-yellow-50 border-b border-yellow-200 flex items-center gap-2 text-sm">
          <AlertCircle className="text-yellow-600" size={16} />
          <span className="text-yellow-800">
            LLM API密钥未配置，当前使用模拟响应模式。配置后将启用真实AI对话。
          </span>
        </div>
      )}
      
      {/* 顶部智能体状态栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 flex-wrap">
          <Sparkles className="text-purple-600" size={20} />
          <span className="text-sm font-medium text-gray-700">活跃智能体：</span>
          {agents.map(agent => (
            <div 
              key={agent.role}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                activeAgents.has(agent.role) 
                  ? `${agent.color} text-white animate-pulse` 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{agent.icon}</span>
              <span>{agent.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* 头像 */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.role === 'system'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
              }`}>
                {message.role === 'user' ? (
                  <User size={16} />
                ) : message.role === 'system' ? (
                  <Sparkles size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>

              {/* 消息内容 */}
              <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                {message.agent && (
                  <span className="text-xs font-medium text-gray-600 mb-1">
                    {message.agent}
                  </span>
                )}
                <div className={`rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.role === 'system'
                    ? 'bg-gray-100 text-gray-700 italic'
                    : 'bg-purple-50 text-gray-900 border border-purple-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-purple-50 rounded-lg px-4 py-2 border border-purple-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题或话题..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Send size={20} />
            发送
          </button>
        </div>
      </div>
    </div>
  )
}