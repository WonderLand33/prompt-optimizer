// Cloudflare Function for optimizing prompts using OpenAI API

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // 记录请求开始时间
  const startTime = Date.now();
  
  // 验证环境变量（临时日志，部署后可删除）
  console.log('🔧 Environment check:', env);
  console.log(env.OPENAI_API_URL)
  
  // CORS headers for SSE
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // SSE headers
  const sseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    ...corsHeaders
  };

  try {
    // Parse request body
    const { prompt, turnstileToken, language = 'en' } = await request.json();

    // Multi-language error messages
    const errorMessages = {
      en: {
        noPrompt: 'Please provide a prompt to optimize',
        noTurnstile: 'Please complete the verification',
        turnstileFailed: 'Verification failed',
        aiUnavailable: 'AI service is temporarily unavailable, please try again later',
        serverError: 'Internal server error'
      },
      zh: {
        noPrompt: '请提供需要优化的Prompt',
        noTurnstile: '请完成验证码验证',
        turnstileFailed: '验证码验证失败',
        aiUnavailable: 'AI服务暂时不可用，请稍后重试',
        serverError: '服务器内部错误'
      }
    };

    const messages = errorMessages[language] || errorMessages.en;

    if (!prompt || !prompt.trim()) {
      return new Response(JSON.stringify({ error: messages.noPrompt }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: messages.noTurnstile }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Verify Turnstile token
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
    });

    const turnstileResult = await turnstileResponse.json();
    
    if (!turnstileResult.success) {
      return new Response(JSON.stringify({ error: messages.turnstileFailed }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Prepare the optimization prompt with multi-language support
    // Use environment variables based on language
    const systemPrompt = language === 'zh' ? env.SYSTEM_PROMPT_ZH : env.SYSTEM_PROMPT_EN;

    const userPrompts = {
      en: `Please optimize the following prompt:

${prompt}`,
      zh: `请优化以下Prompt：

${prompt}`
    };

    const userPrompt = userPrompts[language] || userPrompts.en;

    // Create SSE stream
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    
    // Helper function to send SSE data
    const sendSSE = (data, event = 'data') => {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      return writer.write(new TextEncoder().encode(message));
    };

    // Start the streaming process
    (async () => {
      try {
        // Call OpenAI API with streaming
        const openaiResponse = await fetch(env.OPENAI_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: env.OPENAI_API_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 2000,
            temperature: 0.7,
            stream: true, // 启用流式输出
          }),
        });

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json();
          console.error('OpenAI API Error:', errorData);
          await sendSSE({ error: messages.aiUnavailable }, 'error');
          await writer.close();
          return;
        }

        // Process streaming response
        const reader = openaiResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                break;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content) {
                  fullContent += content;
                  // Send incremental content
                  await sendSSE({ 
                    content: content,
                    fullContent: fullContent 
                  }, 'chunk');
                }
              } catch (e) {
                // Skip invalid JSON
                continue;
              }
            }
          }
        }

        // Send completion event
        const duration = Date.now() - startTime;
        console.log(`✅ Prompt optimization successful - Duration: ${duration}ms`);
        
        await sendSSE({ 
          status: 'complete', 
          optimizedPrompt: fullContent,
          duration: duration 
        }, 'complete');

      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ Function Error (Duration: ${duration}ms):`, error);
        
        await sendSSE({ 
          error: messages.serverError,
          timestamp: new Date().toISOString()
        }, 'error');
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      status: 200,
      headers: sseHeaders
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Function Error (Duration: ${duration}ms):`, error);
    
    // Default error message for catch block (when language might not be available)
    const defaultErrorMessage = 'Internal server error';
    
    return new Response(JSON.stringify({ 
      error: defaultErrorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Handle OPTIONS request for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}