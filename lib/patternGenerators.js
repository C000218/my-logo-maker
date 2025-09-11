// utils/patternGenerators.js

// 1. 特殊十字图案
export const drawSpecialCross = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
  const centerX = 100;
  const centerY = 100;
  const branchLength = 60 + 10 * complexity;
  const branchWidth = 4 + complexity;
  
  const branchAngle = 10 * f1 / 10;
  const secondaryRatio = 0.4 + 0.2 * f2 / 10;
  
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = branchWidth;
  ctx.lineCap = 'round';
  
  // 绘制四个主分支
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, centerY - branchLength);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, centerY + branchLength);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + branchLength, centerY);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX - branchLength, centerY);
  ctx.stroke();
  
  // 绘制次级分支
  const secondaryLength = branchLength * secondaryRatio;
  const secondaryWidth = branchWidth * 0.7;
  ctx.lineWidth = secondaryWidth;
  
  // 上分支的次级分支
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - branchLength);
  ctx.lineTo(centerX + secondaryLength, centerY - branchLength);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - branchLength);
  ctx.lineTo(centerX - secondaryLength, centerY - branchLength);
  ctx.stroke();
  
  // 下分支的次级分支
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + branchLength);
  ctx.lineTo(centerX + secondaryLength, centerY + branchLength);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + branchLength);
  ctx.lineTo(centerX - secondaryLength, centerY + branchLength);
  ctx.stroke();
  
  // 右分支的次级分支
  ctx.beginPath();
  ctx.moveTo(centerX + branchLength, centerY);
  ctx.lineTo(centerX + branchLength, centerY + secondaryLength);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX + branchLength, centerY);
  ctx.lineTo(centerX + branchLength, centerY - secondaryLength);
  ctx.stroke();
  
  // 左分支的次级分支
  ctx.beginPath();
  ctx.moveTo(centerX - branchLength, centerY);
  ctx.lineTo(centerX - branchLength, centerY + secondaryLength);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX - branchLength, centerY);
  ctx.lineTo(centerX - branchLength, centerY - secondaryLength);
  ctx.stroke();
  
  // 添加中心点
  const centerSize = 5 + f3;
  ctx.fillStyle = 'gold';
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
  ctx.fill();
  
  // 添加额外分支
  if (complexity > 3 && f3 > 7) {
    for (let i = 0; i < 4; i++) {
      const angle = 45 + i * 90;
      const tertiaryLength = branchLength * 0.3;
      const endX = centerX + tertiaryLength * Math.cos(angle * Math.PI / 180);
      const endY = centerY + tertiaryLength * Math.sin(angle * Math.PI / 180);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }
};

// 2. 谢尔宾斯基地毯图案
export const drawSierpinskiCarpet = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
  const level = Math.min(complexity, 4);
  const baseSize = 120;
  const gapFactor = 0.05 * f1 / 10;
  
  // 绘制基础正方形
  ctx.fillStyle = primaryColor;
  ctx.fillRect(40, 40, baseSize, baseSize);
  
  // 递归函数生成分形结构
  const createFractal = (x, y, size, currentLevel) => {
    if (currentLevel <= 0) return;
    
    const subSize = size / 3;
    const gap = subSize * gapFactor;
    
    // 创建中心空洞
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x + subSize, y + subSize, subSize, subSize);
    
    // 如果不是最底层，继续递归
    if (currentLevel > 1) {
      const positions = [
        [x, y], [x + subSize, y], [x + 2 * subSize, y],
        [x, y + subSize], [x + 2 * subSize, y + subSize],
        [x, y + 2 * subSize], [x + subSize, y + 2 * subSize], [x + 2 * subSize, y + 2 * subSize]
      ];
      
      for (const [posX, posY] of positions) {
        createFractal(posX, posY, subSize, currentLevel - 1);
      }
    }
  };
  
  // 生成分形结构
  createFractal(40, 40, baseSize, level);
  
  // 添加局部特征 - 额外空洞
  if (f3 > 5) {
    for (let i = 0; i < Math.min(f3 - 5, 4); i++) {
      const angle = i * Math.PI / 2;
      const holeX = 100 + 50 * Math.cos(angle);
      const holeY = 100 + 50 * Math.sin(angle);
      const holeSize = 10 + 5 * f2 / 10;
      
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(holeX - holeSize/2, holeY - holeSize/2, holeSize, holeSize);
    }
  }
};

// 3. 方形谐振环图案
export const drawSquareResonator = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
  const outerSize = 120;
  const outerThickness = 15;
  
  const innerSize = 80;
  const innerThickness = 15;
  
  const gapWidth = 20;
  
  const cornerRadius = 5 * f1 / 10;
  const gapPosition = 3 * f2 / 10;
  
  // 绘制外方形环
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, outerSize, outerSize);
  
  // 绘制外环内方形（白色，用于创建环状效果）
  ctx.strokeStyle = backgroundColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    40 + outerThickness/2, 
    40 + outerThickness/2, 
    outerSize - outerThickness, 
    outerSize - outerThickness
  );
  
  // 绘制内方形环
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    40 + (outerSize - innerSize)/2, 
    40 + (outerSize - innerSize)/2, 
    innerSize, 
    innerSize
  );
  
  // 绘制内环内方形（白色，用于创建环状效果）
  ctx.strokeStyle = backgroundColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    40 + (outerSize - innerSize)/2 + innerThickness/2, 
    40 + (outerSize - innerSize)/2 + innerThickness/2, 
    innerSize - innerThickness, 
    innerSize - innerThickness
  );
  
  // 用白色矩形截取外方形环的右侧部分（形成开口）
  const gapHeight = outerThickness * 2;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(
    40 + outerSize - gapWidth/2 + gapPosition, 
    40 + (outerSize - gapHeight)/2, 
    gapWidth, 
    gapHeight
  );
  
  // 用白色矩形截取内方形环的左侧部分（形成开口）
  ctx.fillRect(
    40 - gapWidth/2 - gapPosition, 
    40 + (outerSize - gapHeight)/2, 
    gapWidth, 
    gapHeight
  );
  
  // 添加局部特征 - 额外缺口
  if (f3 > 5) {
    const extraGapSize = 10;
    ctx.fillRect(
      100 - extraGapSize/2, 
      40 + outerSize - extraGapSize/2, 
      extraGapSize, 
      extraGapSize
    );
  }
};

// 4. 渔网图案
export const drawFishnet = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
  const armLength = 70;
  const armWidth = 12;
  
  const gridDensity = 2 + f1 % 4;
  const diagonalLines = f2 > 5;
  
  const centerX = 100;
  const centerY = 100;
  
  // 绘制水平臂
  ctx.fillStyle = primaryColor;
  ctx.fillRect(
    centerX - armLength/2, 
    centerY - armWidth/2, 
    armLength, 
    armWidth
  );
  
  // 绘制垂直臂
  ctx.fillRect(
    centerX - armWidth/2, 
    centerY - armLength/2, 
    armWidth, 
    armLength
  );
  
  // 添加网格线
  const gridSpacing = armLength / (gridDensity + 1);
  ctx.lineWidth = armWidth * 0.5;
  ctx.strokeStyle = primaryColor;
  
  for (let i = 1; i <= gridDensity; i++) {
    // 水平网格线
    const yPos = centerY - armLength/2 + i * gridSpacing;
    ctx.beginPath();
    ctx.moveTo(centerX - armLength/2, yPos);
    ctx.lineTo(centerX + armLength/2, yPos);
    ctx.stroke();
    
    // 垂直网格线
    const xPos = centerX - armLength/2 + i * gridSpacing;
    ctx.beginPath();
    ctx.moveTo(xPos, centerY - armLength/2);
    ctx.lineTo(xPos, centerY + armLength/2);
    ctx.stroke();
  }
  
  // 添加局部特征 - 对角线
  if (diagonalLines) {
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX - armLength/2, centerY - armLength/2);
    ctx.lineTo(centerX + armLength/2, centerY + armLength/2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX - armLength/2, centerY + armLength/2);
    ctx.lineTo(centerX + armLength/2, centerY - armLength/2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  // 添加局部特征 - 中心点
  if (f3 > 7) {
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, armWidth * 2, 0, Math.PI * 2);
    ctx.fill();
  }
};

// 5. 方形螺旋图案
export const drawSquareSpiral = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
  const numTurns = complexity + 2;
  const startSize = 120;
  const spacing = 24 / complexity;
  const lineWidth = 2;
  
  const gapSize = 2 * f1 / 10;
  const cornerRadius = 5 * f2 / 10;
  
  const centerX = 100;
  const centerY = 100;
  
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  
  for (let turn = 0; turn < numTurns; turn++) {
    const currentSize = startSize - turn * spacing * 2;
    const halfSize = currentSize / 2;
    
    if (turn === 0) {
      // 起始点
      ctx.moveTo(centerX - halfSize, centerY - halfSize);
      // 右上角
      ctx.lineTo(centerX + halfSize, centerY - halfSize);
      // 右下角
      ctx.lineTo(centerX + halfSize, centerY + halfSize);
      // 左下角
      ctx.lineTo(centerX - halfSize, centerY + halfSize);
      // 回到起点附近，但不完全闭合
      ctx.lineTo(centerX - halfSize, centerY - halfSize + spacing);
    } else {
      // 向上
      ctx.lineTo(centerX - halfSize, centerY - halfSize);
      // 向右
      ctx.lineTo(centerX + halfSize, centerY - halfSize);
      // 向下
      ctx.lineTo(centerX + halfSize, centerY + halfSize);
      // 向左
      ctx.lineTo(centerX - halfSize, centerY + halfSize);
      
      // 向下，为下一圈做准备
      if (turn < numTurns - 1) {
        ctx.lineTo(centerX - halfSize, centerY - halfSize + spacing);
      }
    }
  }
  
  ctx.stroke();
  
  // 添加局部特征 - 缺口
  if (f3 > 5) {
    for (let i = 0; i < Math.min(f3 - 5, 4); i++) {
      const angle = i * Math.PI / 2;
      const gapX = 100 + 80 * Math.cos(angle);
      const gapY = 100 + 80 * Math.sin(angle);
      
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(
        gapX - gapSize/2, 
        gapY - gapSize/2, 
        gapSize, 
        gapSize
      );
    }
  }
};

// 6. 嵌套方框图案
export const drawNestedSquares = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
  const numSquares = complexity + 2;
  const startSize = 120;
  const sizeReduction = 20 / complexity;
  
  const rotationAngle = 10 * f1 / 10;
  const gapFactor = 0.05 * f2 / 10;
  
  const centerX = 100;
  const centerY = 100;
  
  ctx.strokeStyle = primaryColor;
  
  for (let i = 0; i < numSquares; i++) {
    const size = startSize - i * sizeReduction;
    const halfSize = size / 2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // 应用旋转
    if (rotationAngle > 0) {
      ctx.rotate((rotationAngle * i * Math.PI) / 180);
    }
    
    ctx.lineWidth = 2 + (numSquares - i) * 0.5;
    ctx.strokeRect(-halfSize, -halfSize, size, size);
    
    // 添加间隙（每隔一个方形添加）
    if (i % 2 === 0 && gapFactor > 0) {
      const gapSize = size * gapFactor;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(-gapSize/2, -gapSize/2, gapSize, gapSize);
    }
    
    ctx.restore();
  }
  
  // 添加局部特征 - 中心点
  if (f3 > 5) {
    const centerSize = 3 + f3 % 5;
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
    ctx.fill();
  }
};

// 7. 双C开口图案
export const drawDoubleCOpening = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
  const size = 100;
  const lineWidth = 6 + complexity;
  
  const gapSize = 20 * f1 / 10;
  const spacing = 10 * f2 / 10;
  
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  
  // 绘制左侧C型（开口向左朝外）
  ctx.beginPath();
  // 上横线（缩短一半，从中心到右侧）
  ctx.moveTo(50, 70);
  ctx.lineTo(100, 70);
  // 下横线（缩短一半，从中心到右侧）
  ctx.moveTo(50, 130);
  ctx.lineTo(100, 130);
  // 右侧竖线（完整）
  ctx.moveTo(100, 70);
  ctx.lineTo(100, 130);
  // 左侧开口线（与缩短线连接）
  ctx.moveTo(50, 70);
  ctx.lineTo(50, 70 + gapSize/2);
  ctx.moveTo(50, 130);
  ctx.lineTo(50, 130 - gapSize/2);
  ctx.stroke();
  
  // 绘制右侧C型（开口向右朝外）
  ctx.beginPath();
  // 上横线（缩短一半，从中心到左侧）
  ctx.moveTo(150, 70);
  ctx.lineTo(100, 70);
  // 下横线（缩短一半，从中心到左侧）
  ctx.moveTo(150, 130);
  ctx.lineTo(100, 130);
  // 左侧竖线（完整）
  ctx.moveTo(100, 70);
  ctx.lineTo(100, 130);
  // 右侧开口线（与缩短线连接）
  ctx.moveTo(150, 70);
  ctx.lineTo(150, 70 + gapSize/2);
  ctx.moveTo(150, 130);
  ctx.lineTo(150, 130 - gapSize/2);
  ctx.stroke();
  
  // 添加局部特征 - 连接线
  if (f3 > 5) {
    const connectLength = 20 + 10 * f3 / 10;
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = lineWidth * 0.7;
    ctx.beginPath();
    ctx.moveTo(100 + spacing, 100);
    ctx.lineTo(100 + connectLength, 100);
    ctx.stroke();
  }
};

// 8. 希腊十字图案
export const drawGreekCross = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
  const armLength = 60;
  const armWidth = 15;
  const centerSize = 30;
  
  const armExtension = 10 * f1 / 10;
  const notchSize = 5 * f2 / 10;
  
  const centerX = 100;
  const centerY = 100;
  
  // 绘制水平臂
  ctx.fillStyle = primaryColor;
  ctx.fillRect(
    centerX - (armLength + armExtension)/2, 
    centerY - armWidth/2, 
    armLength + armExtension, 
    armWidth
  );
  
  // 绘制垂直臂
  ctx.fillRect(
    centerX - armWidth/2, 
    centerY - (armLength + armExtension)/2, 
    armWidth, 
    armLength + armExtension
  );
  
  // 绘制中心区域
  ctx.fillRect(
    centerX - centerSize/2, 
    centerY - centerSize/2, 
    centerSize, 
    centerSize
  );
  
  // 添加局部特征 - 凹口
  if (f3 > 5) {
    for (let i = 0; i < 4; i++) {
      const angle = i * 90;
      const notchX = centerX + (armLength/2 + armExtension/2) * Math.cos(angle * Math.PI / 180);
      const notchY = centerY + (armLength/2 + armExtension/2) * Math.sin(angle * Math.PI / 180);
      
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(
        notchX - notchSize/2, 
        notchY - notchSize/2, 
        notchSize, 
        notchSize
      );
    }
  }
};