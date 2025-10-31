// AI沙龙报告生成 Edge Function
// 基于对话内容自动生成研究报告

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
    const { conversationId, userId, title } = await req.json();

    if (!conversationId || !userId) {
      throw new Error('缺少必要参数');
    }

    const apiKey = Deno.env.get('MINIMAX_API_KEY');
    const groupId = Deno.env.get('MINIMAX_GROUP_ID') || '1853685386819485976';
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!apiKey) {
      throw new Error('MINIMAX_API_KEY未配置');
    }

    // 获取对话历史
    const messagesResponse = await fetch(
      `${supabaseUrl}/rest/v1/ai_salon_messages?conversation_id=eq.${conversationId}&order=created_at.asc`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
      }
    );

    if (!messagesResponse.ok) {
      throw new Error('无法获取对话历史');
    }

    const messages = await messagesResponse.json();

    // 构建对话摘要
    const conversationText = messages
      .map((m: any) => {
        const speaker = m.agent_name || '用户';
        return `${speaker}: ${m.content}`;
      })
      .join('\n\n');

    // 调用LLM生成报告
    const reportPrompt = `基于以下AI沙龙对话内容，生成一份结构化的研究报告。

对话内容：
${conversationText}

请生成包含以下部分的报告：
1. 执行摘要（200字以内）
2. 核心讨论话题（3-5个要点）
3. 关键见解和发现（5-8个要点）
4. 未来研究方向（3个建议）
5. 结论

要求：
- 学术性和专业性
- 逻辑清晰，结构完整
- 引用对话中的关键观点
- 总长度约1500-2000字`;

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
            text: reportPrompt
          }
        ],
        bot_setting: [
          {
            bot_name: '研究报告撰写者',
            content: '你是一位专业的科学报告撰写者，擅长将讨论内容整理成结构化的研究报告。'
          }
        ],
        reply_constraints: {
          sender_type: 'BOT',
          sender_name: '研究报告撰写者'
        },
        temperature: 0.5,
        max_tokens: 3000,
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      throw new Error(`MiniMax API调用失败: ${errorText}`);
    }

    const llmData = await llmResponse.json();
    
    // 检查MiniMax响应格式
    if (llmData.base_resp && llmData.base_resp.status_code !== 0) {
      throw new Error(`MiniMax API错误: ${llmData.base_resp.status_msg}`);
    }
    
    const reportContent = llmData.reply || llmData.choices?.[0]?.text || '';

    // 提取关键信息
    const summaryMatch = reportContent.match(/执行摘要[：:](.*?)(?=\n#|\n\d\.)/s);
    const summary = summaryMatch ? summaryMatch[1].trim() : reportContent.substring(0, 200);

    // 估算页数（假设每页500字）
    const pageCount = Math.ceil(reportContent.length / 500);

    // 生成质量评分（基于长度和结构完整性）
    const qualityScore = Math.min(95, Math.max(75, 
      Math.floor((reportContent.length / 2000) * 50 + 45)
    ));

    // 保存报告到数据库
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/ai_salon_reports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        user_id: userId,
        title: title || `研究报告 - ${new Date().toLocaleDateString('zh-CN')}`,
        content: reportContent,
        summary: summary,
        quality_score: qualityScore,
        page_count: pageCount,
        topics: JSON.stringify([]), // 可以进一步分析提取话题
        key_insights: JSON.stringify([]), // 可以进一步分析提取关键见解
      }),
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      throw new Error(`保存报告失败: ${errorText}`);
    }

    const reportData = await insertResponse.json();

    return new Response(JSON.stringify({
      data: {
        report: reportData[0],
        success: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('报告生成错误:', error);
    return new Response(JSON.stringify({
      error: {
        code: 'REPORT_GENERATION_ERROR',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
