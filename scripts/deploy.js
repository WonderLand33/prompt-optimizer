#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const PROJECT_NAME = 'prompt-optimizer'

console.log('🚀 开始部署 AI Prompt 优化工具...\n')

// 检查是否已登录 Wrangler
try {
  execSync('wrangler whoami', { stdio: 'pipe' })
  console.log('✅ Wrangler 已登录')
} catch (error) {
  console.log('❌ 请先登录 Wrangler: wrangler login')
  process.exit(1)
}

// 构建项目
console.log('📦 构建项目...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ 项目构建完成')
} catch (error) {
  console.log('❌ 构建失败')
  process.exit(1)
}

// 检查 dist 目录
if (!fs.existsSync('dist')) {
  console.log('❌ dist 目录不存在')
  process.exit(1)
}

// 部署到 Cloudflare Pages
console.log('🌐 部署到 Cloudflare Pages...')
try {
  execSync(`wrangler pages deploy dist --project-name ${PROJECT_NAME}`, { 
    stdio: 'inherit' 
  })
  console.log('✅ 部署成功!')
} catch (error) {
  console.log('❌ 部署失败')
  process.exit(1)
}

console.log('\n🎉 部署完成!')
console.log('📝 请确保在 Cloudflare Dashboard 中配置以下环境变量:')
console.log('   - OPENAI_API_KEY')
console.log('   - TURNSTILE_SECRET_KEY')
console.log('   - OPENAI_MODEL (可选)')
console.log('   - OPENAI_API_URL (可选)')
console.log('\n🔗 访问你的应用: https://prompt-optimizer.pages.dev')