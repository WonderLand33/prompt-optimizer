// API 测试文件
// 这个文件可以用来测试 Cloudflare Functions

const API_BASE_URL = 'http://localhost:8788' // Wrangler dev server URL

async function testOptimizePrompt() {
  console.log('🧪 测试 Prompt 优化 API...')
  
  const testPrompt = '写一篇关于人工智能的文章'
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/optimize-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: testPrompt,
        turnstileToken: 'test-token'
      }),
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ API 测试成功')
      console.log('原始 Prompt:', testPrompt)
      console.log('优化后 Prompt:', data.optimizedPrompt)
    } else {
      console.log('❌ API 测试失败:', data.error)
    }
  } catch (error) {
    console.log('❌ 网络错误:', error.message)
  }
}

async function testCORS() {
  console.log('🧪 测试 CORS...')
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/optimize-prompt`, {
      method: 'OPTIONS',
    })
    
    if (response.ok) {
      console.log('✅ CORS 测试成功')
    } else {
      console.log('❌ CORS 测试失败')
    }
  } catch (error) {
    console.log('❌ CORS 测试错误:', error.message)
  }
}

// 运行测试
async function runTests() {
  console.log('🚀 开始 API 测试...\n')
  
  await testCORS()
  console.log('')
  await testOptimizePrompt()
  
  console.log('\n✨ 测试完成')
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
}

export { testOptimizePrompt, testCORS }