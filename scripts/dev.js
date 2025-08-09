#!/usr/bin/env node

import { spawn } from 'child_process'
import fs from 'fs'

console.log('🚀 启动开发环境...\n')

// 检查环境变量文件
if (!fs.existsSync('.env.development')) {
  console.log('⚠️  .env.development 文件不存在，创建默认配置...')
  const defaultEnv = `# Development Environment Variables
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
VITE_API_BASE_URL=http://localhost:3000`
  
  fs.writeFileSync('.env.development', defaultEnv)
  console.log('✅ 已创建 .env.development 文件')
}

// 启动开发服务器
console.log('🌐 启动 Vite 开发服务器...')
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
})

viteProcess.on('close', (code) => {
  console.log(`\n开发服务器已停止 (退出码: ${code})`)
})

// 处理 Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 正在停止开发服务器...')
  viteProcess.kill('SIGINT')
  process.exit(0)
})