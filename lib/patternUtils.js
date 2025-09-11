// 使用Web Crypto API进行SHA256哈希
export async function generateHash(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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