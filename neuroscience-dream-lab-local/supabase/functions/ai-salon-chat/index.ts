// AI沙龙多智能体对话 Edge Function - MiniMax API版本
// 需要在Supabase Secrets中配置：MINIMAX_API_KEY, MINIMAX_GROUP_ID

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { conversationId, userMessage, userId } = await req.json();

    if (!userMessage || !userId) {
      throw new Error('缺少必要参数');
    }

    // 获取MiniMax API配置
    const apiKey = Deno.env.get('MINIMAX_API_KEY');
    const groupId = Deno.env.get('MINIMAX_GROUP_ID') || '1853685386819485976';
    
    // 如果API密钥未配置，使用模拟模式
    const useMockMode = !apiKey;
    
    if (useMockMode) {
      console.log('MiniMax API密钥未配置，使用模拟模式');
    }

    // 定义4个智能体及其系统提示
    const agents = [
      {
        name: '神经科学专家',
        role: 'neuroscientist',
        systemPrompt: `你是一位神经科学专家，专注于大脑功能、神经可塑性和神经系统疾病研究。请用专业但易懂的语言回答问题，引用最新的科学研究。回答要简洁（2-3句话）。`,
        shouldRespond: (message: string) => {
          const keywords = ['神经', '大脑', '突触', '神经元', '认知', '记忆'];
          return keywords.some(k => message.includes(k)) || Math.random() > 0.5;
        }
      },
      {
        name: '梦境分析师',
        role: 'dream_analyst',
        systemPrompt: `你是一位梦境分析师，结合心理学和神经科学来解释梦境的含义和功能。请从潜意识和象征主义角度分析。回答要简洁（2-3句话）。`,
        shouldRespond: (message: string) => {
          const keywords = ['梦', '睡眠', 'REM', '潜意识', '象征'];
          return keywords.some(k => message.includes(k)) || Math.random() > 0.4;
        }
      },
      {
        name: '数据科学家',
        role: 'data_scientist',
        systemPrompt: `你是一位数据科学家，专注于神经科学数据分析和机器学习应用。请从数据和统计的角度提供见解。回答要简洁（2-3句话）。`,
        shouldRespond: (message: string) => {
          const keywords = ['数据', '分析', '模型', '算法', '统计', '预测'];
          return keywords.some(k => message.includes(k)) || Math.random() > 0.4;
        }
      },
      {
        name: '实验设计师',
        role: 'experiment_designer',
        systemPrompt: `你是一位实验设计师，专注于设计严谨的神经科学实验和研究方法。请从实验设计和方法论的角度提供建议。回答要简洁（2-3句话）。`,
        shouldRespond: (message: string) => {
          const keywords = ['实验', '验证', '假设', '方法', '研究', '测试'];
          return keywords.some(k => message.includes(k)) || Math.random() > 0.3;
        }
      }
    ];

    // 决定哪些智能体应该响应
    const respondingAgents = agents.filter(agent => agent.shouldRespond(userMessage));
    
    // 确保至少有一个智能体响应
    if (respondingAgents.length === 0) {
      respondingAgents.push(agents[Math.floor(Math.random() * agents.length)]);
    }

    // 为每个智能体生成响应
    const responses = [];
    
    for (const agent of respondingAgents) {
      try {
        let content = '';
        
        if (useMockMode) {
          // 模拟模式：生成演示响应
          const mockResponses = {
            'neuroscientist': `作为神经科学专家，我认为${userMessage.substring(0, 20)}涉及到大脑的复杂机制。神经可塑性让大脑能够不断适应和学习，这是认知功能的基础。`,
            'dream_analyst': `从梦境分析的角度，${userMessage.substring(0, 20)}反映了潜意识的活动。梦境是大脑整理记忆和情绪的重要过程。`,
            'data_scientist': `根据数据分析，我们可以通过量化指标来研究${userMessage.substring(0, 20)}。机器学习模型能够帮助我们发现隐藏的模式。`,
            'experiment_designer': `要验证关于${userMessage.substring(0, 20)}的假设，我们需要设计严谨的对照实验，控制好各项变量。`
          };
          
          content = mockResponses[agent.role] || `关于您的问题"${userMessage}"，这是一个很有趣的话题。从${agent.name}的角度来看，我们需要深入研究。`;
          
          // 添加提示信息
          content += '\n\n（注：当前为演示模式，请配置MiniMax API密钥以启用真实AI对话）';
          
          // 模拟API延迟
          await new Promise(resolve => setTimeout(resolve, 800));
        } else {
          // 真实API模式：调用MiniMax Chat Completion Pro API
          const llmResponse = await fetch(`https://api.minimax.chat/v1/text/chatcompletion_v2?GroupId=${groupId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
            body: JSON.stringify({
              model: 'abab6.5s-chat',
              messages: [
                {
                  sender_type: 'USER',
                  sender_name: '用户',
                  text: userMessage
                }
              ],
              bot_setting: [
                {
                  bot_name: agent.name,
                  content: agent.systemPrompt
                }
              ],
              reply_constraints: {
                sender_type: 'BOT',
                sender_name: agent.name
              },
              temperature: 0.7,
              max_tokens: 300,
            }),
          });

          if (!llmResponse.ok) {
            const errorText = await llmResponse.text();
            console.error(`MiniMax API调用失败 (${agent.name}):`, errorText);
            continue;
          }

          const llmData = await llmResponse.json();
          
          // 检查MiniMax响应格式
          if (llmData.base_resp && llmData.base_resp.status_code !== 0) {
            console.error(`MiniMax API错误 (${agent.name}):`, llmData.base_resp.status_msg);
            continue;
          }

          // 提取回复内容
          content = llmData.reply || llmData.choices?.[0]?.text || '';
          
          if (!content) {
            console.warn(`${agent.name} 返回空内容`);
            continue;
          }
          
          // 添加延迟模拟真实对话节奏
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // 保存响应
        if (content) {
          responses.push({
            agentName: agent.name,
            agentRole: agent.role,
            content: content.trim()
          });
        }
      } catch (agentError) {
        console.error(`${agent.name} 处理失败:`, agentError);
        // 继续处理其他智能体
      }
    }

    // 确保至少有一个响应
    if (responses.length === 0) {
      responses.push({
        agentName: '神经科学专家',
        agentRole: 'neuroscientist',
        content: useMockMode 
          ? '欢迎使用AI沙龙！当前为演示模式，请配置MiniMax API密钥以启用完整功能。'
          : '抱歉，当前AI服务暂时不可用。请稍后再试。'
      });
    }

    return new Response(JSON.stringify({
      data: {
        responses,
        conversationId
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI沙龙错误:', error);
    return new Response(JSON.stringify({
      error: {
        code: 'AI_SALON_ERROR',
        message: error.message || '未知错误'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
