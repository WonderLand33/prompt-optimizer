// Mock API for development
export const mockOptimizePrompt = async (prompt) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 模拟优化后的prompt
  const optimizedPrompt = `## 优化后的Prompt

**角色设定**: 你是一个专业的${getPromptDomain(prompt)}专家。

**任务描述**: ${prompt}

**输出要求**:
1. 请提供详细、准确的回答
2. 使用清晰的结构和逻辑
3. 包含具体的例子或步骤
4. 确保信息的实用性和可操作性

**输出格式**: 
- 使用标准的markdown格式
- 重要信息用**粗体**标注
- 如有步骤，请使用有序列表

**注意事项**: 
- 保持专业性和准确性
- 避免模糊或含糊的表述
- 如有不确定的信息，请明确说明

请基于以上要求完成任务。`

  return { optimizedPrompt }
}

function getPromptDomain(prompt) {
  const domains = {
    '代码': ['代码', '编程', '开发', 'code', 'programming'],
    '写作': ['写作', '文章', '内容', '文案', 'writing'],
    '分析': ['分析', '数据', '研究', 'analysis'],
    '设计': ['设计', '创意', 'design'],
    '教育': ['教学', '学习', '教育', 'education'],
    '商业': ['商业', '营销', '市场', 'business']
  }
  
  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
      return domain
    }
  }
  
  return 'AI助手'
}