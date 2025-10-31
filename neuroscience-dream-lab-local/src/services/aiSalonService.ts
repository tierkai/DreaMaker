// AI沙龙API服务
import { supabase } from '../lib/supabase'

export interface AIMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentName?: string
  agentRole?: string
  timestamp: Date
}

export interface AIConversation {
  id: string
  userId: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export interface AIReport {
  id: string
  conversationId?: string
  userId: string
  title: string
  content: string
  summary?: string
  qualityScore?: number
  pageCount?: number
  createdAt: Date
}

/**
 * 创建新对话
 */
export async function createConversation(userId: string, title: string): Promise<AIConversation | null> {
  try {
    const { data, error } = await supabase
      .from('ai_salon_conversations')
      .insert({
        user_id: userId,
        title: title
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('创建对话失败:', error)
    return null
  }
}

/**
 * 获取用户的对话列表
 */
export async function getUserConversations(userId: string): Promise<AIConversation[]> {
  try {
    const { data, error } = await supabase
      .from('ai_salon_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取对话列表失败:', error)
    return []
  }
}

/**
 * 获取对话消息
 */
export async function getConversationMessages(conversationId: string): Promise<AIMessage[]> {
  try {
    const { data, error } = await supabase
      .from('ai_salon_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取消息失败:', error)
    return []
  }
}

/**
 * 发送用户消息并获取AI响应
 */
export async function sendMessage(
  conversationId: string,
  userId: string,
  message: string
): Promise<{ success: boolean; responses?: any[] }> {
  try {
    // 保存用户消息
    const { error: saveError } = await supabase
      .from('ai_salon_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message
      })

    if (saveError) throw saveError

    // 调用Edge Function获取AI响应
    const { data, error } = await supabase.functions.invoke('ai-salon-chat', {
      body: {
        conversationId,
        userId,
        userMessage: message
      }
    })

    if (error) throw error

    // 更新对话的最后更新时间
    await supabase
      .from('ai_salon_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    return {
      success: true,
      responses: data?.data?.responses || []
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    return { success: false }
  }
}

/**
 * 生成研究报告
 */
export async function generateReport(
  conversationId: string,
  userId: string,
  title?: string
): Promise<{ success: boolean; report?: AIReport }> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-salon-generate-report', {
      body: {
        conversationId,
        userId,
        title
      }
    })

    if (error) throw error

    return {
      success: true,
      report: data?.data?.report
    }
  } catch (error) {
    console.error('生成报告失败:', error)
    return { success: false }
  }
}

/**
 * 获取用户的报告列表
 */
export async function getUserReports(userId: string): Promise<AIReport[]> {
  try {
    const { data, error } = await supabase
      .from('ai_salon_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取报告列表失败:', error)
    return []
  }
}

/**
 * 订阅对话消息的实时更新
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (message: AIMessage) => void
) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_salon_messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        callback(payload.new as AIMessage)
      }
    )
    .subscribe()
}
