// 设计规则引擎 - 将用户答案映射到设计元素
import { generateHash, extractPatternParameters } from './patternUtils';

// 主要函数 - 使用命名导出
export const getLogoDesign = async (userData) => {
  const { initials, birthday, favoriteColor } = userData;
  
  // 1. 基于生日的哈希图案生成
  let patternParams = { patternType: 0, symmetry: 4, complexity: 2 };
  
  try {
    if (birthday) {
      const hashHex = await generateHash(birthday);
      patternParams = extractPatternParameters(hashHex);
    }
  } catch (error) {
    console.error("Hash generation failed:", error);
  }
  
  // 2. 基于姓名缩写的设计规则
  const initialsDesign = getInitialsDesign(initials);
  
  // 3. 基于颜色的设计规则
  const colorDesign = getColorDesign(favoriteColor);
  
  // 返回组合后的设计配置
  return {
    layout: initialsDesign.layout,
    patternType: patternParams.patternType,
    symmetry: patternParams.symmetry,
    complexity: patternParams.complexity,
    feature1: patternParams.feature1,
    feature2: patternParams.feature2,
    feature3: patternParams.feature3,
    colors: colorDesign.colors,
    footerText: "Bionic Metamaterials"
  };
};

// 1. 处理姓名缩写的函数 - 决定基元排列方式
const getInitialsDesign = (initials) => {
  const length = initials?.length || 0;
  
  // 根据缩写长度决定布局
  let layout;
  
  if (length <= 1) {
    layout = '1x1';
  } else if (length === 2) {
    layout = '1x2';
  } else if (length === 3) {
    layout = '2x3';
  } else if (length === 4) {
    layout = '2x2';
  } else {
    // 对于更多字母，使用近似正方形布局
    const rows = Math.floor(Math.sqrt(length));
    const cols = Math.ceil(length / rows);
    layout = `${rows}x${cols}`;
  }
  
  return { layout };
};

// 2. 处理颜色的函数
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
      secondary: '#fff7e6',
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