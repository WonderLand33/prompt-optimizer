// 多语言配置
export const languages = {
  en: 'English',
  zh: '中文'
}

export const translations = {
  en: {
    // Header
    title: 'AI Prompt Optimizer',
    toggleTheme: 'Toggle Theme',
    
    // Main content
    mainTitle: 'Make AI Better Understand Your',
    promptText: 'Prompt',
    mainDescription: 'Enter your original prompt, and our AI will help you optimize it to make it clearer, more specific, and more effective.',
    
    // Form
    inputLabel: 'Original Prompt',
    inputPlaceholder: 'Please enter the prompt you want to optimize...',
    optimizeButton: 'Optimize Prompt',
    optimizing: 'Optimizing...',
    
    // Output
    outputLabel: 'Optimized Prompt',
    copy: 'Copy',
    copied: 'Copied',
    
    // Tips
    tipsTitle: 'Optimization Tips',
    tips: [
      'Provide specific context and background information',
      'Clearly specify the expected output format',
      'Use clear and concise language',
      'Include relevant examples or references',
      'Specify target audience or use case'
    ],
    
    // Footer
    poweredBy: 'Powered by OpenAI & Cloudflare',
    
    // Error messages
    errorEmptyPrompt: 'Please enter a prompt to optimize',
    errorTurnstileNotCompleted: 'Please complete the verification',
    errorVerificationFailed: 'Verification failed',
    errorRequestFailed: 'Request failed, please try again',
    errorServerError: 'Server internal error',
    errorAIUnavailable: 'AI service temporarily unavailable, please try again later',
    
    // Language selector
    language: 'Language',
    selectLanguage: 'Select Language'
  },
  zh: {
    // Header
    title: 'AI Prompt 优化工具',
    toggleTheme: '切换主题',
    
    // Main content
    mainTitle: '让AI更好地理解你的',
    promptText: 'Prompt',
    mainDescription: '输入你的原始Prompt，我们的AI将帮助你优化它，使其更加清晰、具体和有效。',
    
    // Form
    inputLabel: '原始 Prompt',
    inputPlaceholder: '请输入你想要优化的Prompt...',
    optimizeButton: '优化 Prompt',
    optimizing: '优化中...',
    
    // Output
    outputLabel: '优化后的 Prompt',
    copy: '复制',
    copied: '已复制',
    
    // Tips
    tipsTitle: '优化建议',
    tips: [
      '提供具体的上下文和背景信息',
      '明确指定期望的输出格式',
      '使用清晰、简洁的语言',
      '包含相关的示例或参考',
      '指定目标受众或使用场景'
    ],
    
    // Footer
    poweredBy: 'Powered by OpenAI & Cloudflare',
    
    // Error messages
    errorEmptyPrompt: '请输入需要优化的Prompt',
    errorTurnstileNotCompleted: '请完成验证码验证',
    errorVerificationFailed: '验证码验证失败',
    errorRequestFailed: '请求失败，请重试',
    errorServerError: '服务器内部错误',
    errorAIUnavailable: 'AI服务暂时不可用，请稍后重试',
    
    // Language selector
    language: '语言',
    selectLanguage: '选择语言'
  }
}

// 获取浏览器语言偏好
export const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith('zh')) {
    return 'zh'
  }
  return 'en' // 默认英文
}

// 获取翻译文本
export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations.en[key] || key
}