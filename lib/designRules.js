// lib/designRules.js
// 设计规则引擎 - 将用户答案映射到设计元素

// 主要函数 - 使用命名导出
export const getLogoDesign = (userData) => {
  const { initials, birthday, favoriteColor, hobbies } = userData;
  
  // 1. 基于姓名缩写的设计规则
  const initialsDesign = getInitialsDesign(initials);
  
  // 2. 基于生日的设计规则
  const birthdayDesign = getBirthdayDesign(birthday);
  
  // 3. 基于颜色的极速版设计规则
  const colorDesign = get极速版ColorDesign(favoriteColor);
  
  // 返回组合后的设计配置
  return {
    layout: initialsDesign.layout, // 基元排列方式 (如 "2x3")
    shape: birthdayDesign.shape,   // 基元图案
    colors: colorDesign.colors,    // 颜色方案
    patternType: birthdayDesign.patternType, // 图案类型
    symmetry: birthdayDesign.symmetry, // 对称性
    complexity: birthdayDesign.complexity, // 复杂度
    features: birthdayDesign.features, // 特征参数
    // 兴趣爱好不纳入设计规则，只在页面显示
    footerText: "Bionic Metamaterials" // 固定底部文本
  };
};

// 1. 处理姓名缩写的函数 - 决定基元排列方式
const getInitialsDesign = (initials) => {
  const length = initials.length;
  
  // 根据缩写长度决定布局
  let layout;
  
  if (length === 1) {
    layout = '1x1';
  } else if (length === 2) {
    layout = '2x2';
  } else if (length === 3) {
    layout = '2x3'; // 3个字母使用2x3布局
  } else if (length === 4) {
    layout = '2x4'; // 4个字母使用2x4布局
  } else {
    // 对于更多字母，使用近似正方形布局
    const rows = Math.floor(Math.sqrt(length));
    const cols = Math.ceil(length / rows);
    layout = `${rows}x${cols}`;
  }
  
  return { layout };
};

// 2. 处理生日的函数 - 决定基元图案
const getBirthdayDesign = (birthday) => {
  if (!birthday) return { shape: 'circle' };
  
  // 将出生日期转换为哈希值作为随机种子
  const hash = hashString(birthday);
  
  // 从哈希值提取核心参数
  const patternType = parseInt(hash[0], 16) % 8;  // 图案类型 (0-7)
  const symmetry = parseInt(hash[1], 16) % 7 + 2;   // 对称性 (2-8重对称)
  const complexity = parseInt(hash[2], 16) % 5 + 1; // 复杂度 (1-5级)
  
  // 提取特征参数用于局部修正
  const feature1 = parseInt(hash[3], 16) % 10;  // 特征参数1
  const feature2 = parseInt(hash[4], 16) % 10;  // 特征参数2
  const feature3 = parseInt(hash[5], 16) % 10;  // 特征参数3
  
  // 图案类型名称映射
  const patternNames = [
    "特殊十字", "谢尔宾斯基地毯", "方形谐振环", "渔网结构", 
    "方形螺旋", "嵌套方框", "双C开口", "希腊十字"
  ];
  
  // 形状由图案类型决定，而不是月份
  const shapes = [
    'cross', '极速版square', 'square', 'grid',
    'spiral', 'square', 'cshape', 'cross'
  ];
  
  return {
    shape: shapes[patternType] || 'circle',
    patternType,
    patternName: patternNames[patternType],
    symmetry,
    complexity,
    features: [feature1, feature2, feature3]
  };
};

// 3. 处理颜色的函数
const getColorDesign = (favoriteColor) => {
  // 颜色配置映射
  const colorPalettes = {
    red: {
      primary: '#ff4d4f',
      secondary: '#fff2f0',
      accent: '#cf1322'
    },
    blue: {
      primary: '#1890ff',
      secondary: '#f0f5ff',
      accent: '#096dd9'
    },
    green: {
      primary: '#52c41a',
      secondary: '#f6ffed',
      accent: '#389e0d'
    },
    yellow: {
      primary: '#fadb14',
      secondary: '#feffe6',
      accent: '#d4b106'
    },
    purple: {
      primary: '#722ed1',
      secondary: '#f9f0ff',
      accent: '#531dab'
    },
    orange: {
      primary: '#fa8c16',
      secondary: '#72867dff',
      accent: '#d46b08'
    },
    pink: {
      primary: '#eb2f96',
      secondary: '#fff0f6',
      accent: '#c41d7f'
    },
    cyan: {
      primary: '#13c2c2',
      secondary: '#e6fffb',
      accent: '#08979c'
    }
  };
  
  return {
    colors: colorPalettes[favoriteColor] || colorPalettes.blue
  };
};

// 哈希函数
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// 注意: 兴趣爱好不纳入设计规则，只在问卷中显示