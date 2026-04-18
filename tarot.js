// Vercel Serverless Function: /api/tarot
// 作为 DeepSeek API 的安全代理，隐藏 API key

export default async function handler(req, res) {
  // CORS 头（允许本域名调用；生产环境可限制为你的域名）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server API key not configured' });
  }

  try {
    const { question, cards } = req.body || {};

    if (!question || !Array.isArray(cards) || cards.length !== 3) {
      return res.status(400).json({ error: 'Invalid request body. Expected { question, cards: [3 cards] }' });
    }

    // 基本输入校验 — 防止滥用
    if (typeof question !== 'string' || question.length > 300) {
      return res.status(400).json({ error: 'Question too long or invalid' });
    }

    // 构造 prompt
    const posLabels = ['过去', '现在', '未来'];
    const cardsDesc = cards.map((d, i) => {
      const kws = d.reversed ? d.card.down : d.card.up;
      return `【${posLabels[i]}】${d.card.name}（${d.reversed ? '逆位' : '正位'}）- 关键词：${(kws || []).join('、')}`;
    }).join('\n');

    const systemPrompt = '你是一位资深且富有文学性的韦特塔罗占卜师。用简体中文回复，语言凝练有诗意但不故弄玄虚，不要使用 markdown 符号。严格紧扣用户具体问题，不泛泛而谈。';

    const userPrompt = `用户的问题是：「${question}」

抽到的牌阵（圣三角：过去-现在-未来）：
${cardsDesc}

请严格按以下 JSON 格式输出解读，不要有任何额外文字或 markdown 代码块标记：
{
  "overview": "牌阵综述：用 2-3 句话描述三张牌整体的能量场、主导元素（火/水/风/土）、情绪基调。",
  "timeline": "时序推演：150-220字。串联过去-现在-未来的因果关系，结合用户具体问题，不要泛泛而谈。",
  "advice": "最终指引：100-160字。给 2-3 条具体可执行的行动建议，不空话。"
}`;

    const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 1.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });

    if (!dsRes.ok) {
      const errText = await dsRes.text();
      console.error('DeepSeek API error:', dsRes.status, errText);
      return res.status(502).json({ error: 'Upstream API error', status: dsRes.status });
    }

    const data = await dsRes.json();
    const content = data?.choices?.[0]?.message?.content || '';

    // 尝试解析 JSON 响应
    let parsed;
    try {
      const clean = content.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      // 宽松解析：抓出第一个 {...} 块
      const m = content.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          parsed = JSON.parse(m[0]);
        } catch (e2) {
          return res.status(502).json({ error: 'Failed to parse model output', raw: content.slice(0, 500) });
        }
      } else {
        return res.status(502).json({ error: 'Unexpected model response format', raw: content.slice(0, 500) });
      }
    }

    if (!parsed.overview || !parsed.timeline || !parsed.advice) {
      return res.status(502).json({ error: 'Missing required fields in model response', got: parsed });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
