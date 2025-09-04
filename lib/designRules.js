// lib/designRules.js
// 设计规则引擎 - 将用户答案映射到设计元素

// 主要函数 - 使用命名导出
export const getLogoDesign = (userData) => {
  const { initials, birthday, favoriteColor, hobbies } = userData;
  
  // 1. 基于姓名缩写的设计规则
  const initialsDesign = getInitialsDesign(initials);
  
  // 2. 基于生日的设计规则
  const birthdayDesign = getBirthdayDesign(birthday);
  
  // 3. 基于颜色的设计规则
  const colorDesign = getColorDesign(favoriteColor);
  
  // 4. 基于兴趣爱好的设计规则
  const hobbiesDesign = getHobbiesDesign(hobbies);
  
  // 返回组合后的设计配置
  return {
    text: initialsDesign.text,
    shape: birthdayDesign.shape,
    colors: colorDesign.colors,
    icon: hobbiesDesign.icon,
    style: {
      layout: initialsDesign.layout,
      complexity: birthdayDesign.complexity
    }
  };
};

// 1. 处理姓名缩写的函数
const getInitialsDesign = (initials) => {
  const length = initials.length;
  
  // 根据缩写长度决定布局
  let layout, text;
  
  if (length === 1) {
    layout = 'centered';
    text = initials.toUpperCase();
  } else if (length === 2) {
    layout = 'side-by-side';
    text = initials.toUpperCase().split('').join('');
  } else {
    layout = 'stacked';
    text = initials.toUpperCase().split('').join('\n');
  }
  
  return { text, layout };
};

// 2. 处理生日的函数
const getBirthdayDesign = (birthday) => {
  if (!birthday) return { shape: 'circle', complexity: 'simple' };
  
  const date = new Date(birthday);
  const month = date.getMonth() + 1; // 0-11 → 1-12
  const day = date.getDate();
  
  // 根据月份决定形状
  const shapesByMonth = {
    1: 'circle',      // 一月 - 圆形，象征新的开始
    2: 'heart',       // 二月 - 心形，情人节
    3: 'triangle',    // 三月 - 三角形，象征稳定
    4: 'square',      // 四月 - 方形，坚实可靠
    5: 'pentagon',    // 五月 - 五边形，象征活力
    6: 'hexagon',     // 六月 - 六边形，蜂窝结构
    7: 'star',        // 七月 - 星形，夏季星空
    8: 'diamond',     // 八月 - 钻石形，珍贵闪耀
    9: 'cloud',       // 九月 - 云形，秋高气爽
    10: 'leaf',       // 十月 - 叶子形，秋季落叶
    11: 'moon',       // 十一月 - 月牙形，冬夜漫长
    12: 'snowflake'   // 十二月 - 雪花形，冬季雪花
  };
  
  // 根据日期决定复杂度（单双数）
  const complexity = day % 2 === 0 ? 'complex' : 'simple';
  
  return {
    shape: shapesByMonth[month] || 'circle',
    complexity
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

// 4. 处理兴趣爱好的函数
// 更新兴趣爱好到图标的映射
const iconKeywords = {
  // 运动相关
  '运动': 'dribbble', '篮球': 'dribbble', '足球': 'dribbble', '跑步': 'dribbble',
  '游泳': 'dribbble', '健身': 'dribbble', '瑜伽': 'dribbble', '网球': 'dribbble',
  '乒乓球': 'dribbble', '羽毛球': 'dribbble', '滑雪': 'dribbble', '滑板': 'dribbble',
  
  // 艺术相关
  '音乐': 'music', '唱歌': 'music', '钢琴': 'music', '吉他': 'music', 
  '小提琴': 'music', '舞蹈': 'music', '绘画': 'picture', '摄影': 'camera',
  '设计': 'highlight', '艺术': 'highlight', '创作': 'highlight',
  
  // 智力活动
  '阅读': 'book', '书籍': 'book', '学习': 'read', '写作': 'edit', 
  '编程': 'code', '棋类': 'experiment', '数学': 'experiment', '科学': 'experiment',
  '哲学': 'read', '历史': 'read',
  
  // 户外活动
  '旅行': 'compass', '登山': 'environment', '徒步': 'environment', '露营': 'fire',
  '钓鱼': 'environment', '骑行': 'environment', '探险': 'compass',
  
  // 休闲娱乐
  '电影': 'play-square', '游戏': 'gamepad', '收集': 'gift', '手工': 'tool',
  '烹饪': 'rest', '美食': 'rest', '咖啡': 'coffee', '茶': 'coffee', '酒': 'rest',
  '购物': 'shopping', '社交': 'team',
  
  // 自然与动物
  '宠物': 'heart', '狗': 'heart', '猫': 'heart', '植物': 'environment',
  '园艺': 'environment', '花卉': 'environment', '星空': 'star',
  
  // 其他
  '汽车': 'car', '摩托车': 'car', '飞行': 'car', '航海': 'car',
  '志愿者': 'team', '慈善': 'team', '冥想': 'fire', '宗教': 'fire'
};

// 在getHobbiesDesign函数中更新匹配逻辑
const getHobbiesDesign = (hobbies) => {
  if (!hobbies) return { icon: 'star' };
  
  const hobbiesStr = hobbies.toLowerCase();
  let selectedIcon = 'user'; // 默认图标
  
  // 优先匹配更具体的爱好
  const hobbyList = hobbiesStr.split(/[,，、\s]+/); // 支持多种分隔符
  
  for (const hobby of hobbyList) {
    for (const [keyword, icon] of Object.entries(iconKeywords)) {
      if (hobby.includes(keyword.toLowerCase())) {
        selectedIcon = icon;
        break;
      }
    }
    if (selectedIcon !== 'user') break; // 找到匹配就停止
  }
  
  return { icon: selectedIcon };
};

// 确保没有默认导出
// 不要有这一行: export default getLogoDesign;