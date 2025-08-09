import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Copy, Check, AlertCircle, Moon, Sun } from 'lucide-react'
import Turnstile from './components/Turnstile'
import { mockOptimizePrompt } from './utils/mockApi'

function App() {
  const [inputPrompt, setInputPrompt] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const turnstileRef = useRef(null)

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // 切换主题
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!inputPrompt.trim()) {
      setError('请输入需要优化的Prompt')
      return
    }

    setIsLoading(true)
    setIsStreaming(false)
    setError('')
    setOptimizedPrompt('')
    setStreamingContent('')
    setStatusMessage('')

    try {
      // 获取Turnstile token (开发环境跳过验证)
      let turnstileToken = turnstileRef.current?.getResponse()
      if (!turnstileToken && import.meta.env.DEV) {
        turnstileToken = 'dev-token' // 开发环境使用假token
      }
      if (!turnstileToken) {
        throw new Error('请完成验证码验证')
      }

      if (import.meta.env.DEV) {
        // 开发环境使用模拟流式API
        await simulateStreamingResponse(inputPrompt)
      } else {
        // 生产环境使用真实SSE API
        await handleSSEResponse(inputPrompt, turnstileToken)
      }
      
      // 重置Turnstile
      if (turnstileRef.current) {
        turnstileRef.current.reset()
      }
    } catch (err) {
      setError(err.message)
      setIsStreaming(false)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理SSE响应
  const handleSSEResponse = async (prompt, turnstileToken) => {
    const response = await fetch('/api/optimize-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        turnstileToken
      }),
    })

    if (!response.ok) {
      throw new Error('请求失败')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    setIsLoading(false)
    setIsStreaming(true)

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event: ') && lines[lines.indexOf(line) + 1]?.startsWith('data: ')) {
            const event = line.slice(7)
            const dataLine = lines[lines.indexOf(line) + 1]
            const data = dataLine.slice(6)
            
            try {
              const parsed = JSON.parse(data)
              
              switch (event) {
                case 'status':
                  setStatusMessage(parsed.message)
                  break
                case 'chunk':
                  setStreamingContent(parsed.fullContent)
                  break
                case 'complete':
                  setOptimizedPrompt(parsed.optimizedPrompt)
                  setStreamingContent('')
                  setStatusMessage('')
                  setIsStreaming(false)
                  break
                case 'error':
                  throw new Error(parsed.error)
              }
            } catch (e) {
              console.error('解析SSE数据失败:', e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  // 模拟流式响应（开发环境）
  const simulateStreamingResponse = async (prompt) => {
    setIsLoading(false)
    setIsStreaming(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟流式输出
    const mockResult = await mockOptimizePrompt(prompt)
    const text = mockResult.optimizedPrompt
    
    for (let i = 0; i <= text.length; i += 3) {
      setStreamingContent(text.slice(0, i))
      await new Promise(resolve => setTimeout(resolve, 30))
    }
    
    setOptimizedPrompt(text)
    setStreamingContent('')
    setIsStreaming(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
      {/* Header */}
      <header className="border-b border-openai-border dark:border-dark-border bg-white dark:bg-dark-bg transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-openai-green rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-openai-text dark:text-dark-text transition-colors">
                AI Prompt 优化工具
              </h1>
            </div>
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-openai-gray dark:bg-dark-surface border border-openai-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              aria-label="切换主题"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-openai-text dark:text-dark-text" />
              ) : (
                <Moon className="w-5 h-5 text-openai-text dark:text-dark-text" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-openai-text dark:text-dark-text mb-4 transition-colors">
            让AI更好地理解你的
            <span className="gradient-text"> Prompt</span>
          </h2>
          <p className="text-openai-light-gray dark:text-dark-text-secondary text-lg max-w-2xl mx-auto transition-colors">
            输入你的原始Prompt，我们的AI将帮助你优化它，使其更加清晰、具体和有效。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Section */}
          <div className="bg-openai-gray dark:bg-dark-surface rounded-lg p-6 transition-colors">
            <label htmlFor="input-prompt" className="block text-sm font-medium text-openai-text dark:text-dark-text mb-3 transition-colors">
              原始 Prompt
            </label>
            <textarea
              id="input-prompt"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="请输入你想要优化的Prompt..."
              className="w-full h-32 p-4 border border-openai-border dark:border-dark-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-openai-green focus:border-transparent bg-white dark:bg-dark-input text-openai-text dark:text-dark-text placeholder-openai-light-gray dark:placeholder-dark-text-secondary transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Turnstile Verification */}
          <div className="flex justify-center">
            <Turnstile ref={turnstileRef} />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || isStreaming || !inputPrompt.trim()}
              className="inline-flex items-center px-6 py-3 bg-openai-green text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-openai-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading || isStreaming ? (
                <>
                  <div className="loading-dots mr-2">优化中</div>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  优化 Prompt
                </>
              )}
            </button>
          </div>
        </form>



        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center transition-colors">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {/* Streaming Content */}
        {isStreaming && streamingContent && (
          <div className="mt-8 bg-openai-gray dark:bg-dark-surface rounded-lg p-6 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-openai-text dark:text-dark-text transition-colors">
                优化后的 Prompt
              </label>
            </div>
            <div className="bg-white dark:bg-dark-input p-4 border border-openai-border dark:border-dark-border rounded-lg transition-colors">
              <pre className="whitespace-pre-wrap text-openai-text dark:text-dark-text font-mono text-sm leading-relaxed transition-colors">
                {streamingContent}
                <span className="animate-pulse">|</span>
              </pre>
            </div>
          </div>
        )}

        {/* Output Section */}
        {optimizedPrompt && !isStreaming && (
          <div className="mt-8 bg-openai-gray dark:bg-dark-surface rounded-lg p-6 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-openai-text dark:text-dark-text transition-colors">
                优化后的 Prompt
              </label>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-3 py-1.5 text-sm text-openai-green hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    复制
                  </>
                )}
              </button>
            </div>
            <div className="bg-white dark:bg-dark-input p-4 border border-openai-border dark:border-dark-border rounded-lg transition-colors">
              <pre className="whitespace-pre-wrap text-openai-text dark:text-dark-text font-mono text-sm leading-relaxed transition-colors">
                {optimizedPrompt}
              </pre>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 transition-colors">
          <h3 className="text-lg font-semibold text-openai-text dark:text-dark-text mb-3 transition-colors">
            💡 优化建议
          </h3>
          <ul className="space-y-2 text-openai-light-gray dark:text-dark-text-secondary transition-colors">
            <li>• 提供具体的上下文和背景信息</li>
            <li>• 明确指定期望的输出格式</li>
            <li>• 使用清晰、简洁的语言</li>
            <li>• 包含相关的示例或参考</li>
            <li>• 指定目标受众或使用场景</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-openai-border dark:border-dark-border bg-openai-gray dark:bg-dark-surface mt-16 transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-openai-light-gray dark:text-dark-text-secondary transition-colors">
          <p>Powered by OpenAI & Cloudflare</p>
        </div>
      </footer>
    </div>
  )
}

export default App