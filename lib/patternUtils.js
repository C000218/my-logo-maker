// 安全的哈希生成函数
export async function generateHash(input) {
  // 确保输入是字符串
  const str = String(input || 'default');
  
  try {
    // 检查浏览器是否支持 crypto.subtle
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // 不支持 crypto.subtle 时的备用方案
      throw new Error('crypto.subtle not available');
    }
  } catch (error) {
    console.warn('SHA256哈希失败，使用备用方法:', error);
    
    // 简单但有效的备用哈希方法
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}

// 提取图案参数
export function extractPatternParameters(hashHex) {
  return {
    patternType: parseInt(hashHex[0], 16) % 8,
    symmetry: parseInt(hashHex[1], 16) % 7 + 2,
    complexity: parseInt(hashHex[2], 16) % 5 + 1,
    feature1: parseInt(hashHex[3], 16) % 10,
    feature2: parseInt(hashHex[4], 16) % 10,
    feature3: parseInt(hashHex[5], 16) % 10
  };
}

// 图案名称映射
export const patternNames = [
  "特殊十字", "谢尔宾斯基地毯", "方形谐振环", "渔网结构", 
  "方形螺旋", "嵌套方框", "双C开口", "希腊十字"
];