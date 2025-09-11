'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';
import Image from 'next/image';

// 图案绘制函数 - 直接放在组件文件中
// 1. 特殊十字图案
const drawSpecialCross = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
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
const drawSierpinskiCarpet = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
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
const drawSquareResonator = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
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
const drawFishnet = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
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
const drawSquareSpiral = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
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
const drawNestedSquares = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
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
const drawDoubleCOpening = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
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
 极速版ctx.lineTo(100, 130);
  // 右侧开口线（与缩短线连接）
  ctx.moveTo(150, 70);
  ctx.lineTo(150, 70 + gapSize/2);
  ctx.moveTo(150, 130);
  ctx.lineTo(150, 130 -gapSize/2);
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
const drawGreekCross = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor, backgroundColor) => {
  const armLength = 60;
  const armWidth = 15;
  const centerSize = 30;
  
  const armExtension = 10 *f1 / 10;
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
  
  // 极速版绘制垂直臂
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

const LogoPreview = ({ designConfig }) => {
  // 首先声明所有Hook - 这是修复的关键
  const logoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [patternImage, setPatternImage] = useState(null);

  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 使用useCallback包装生成图案的函数，避免不必要的重新创建
  const generatePattern = useCallback(() => {
    if (!designConfig) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置背景色
    ctx.fillStyle = designConfig.colors?.secondary || "#f0f5ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 根据图案类型绘制不同的图案
    const [f1, f2, f3] = designConfig.features || [5, 5, 5];
    const patternType = designConfig.patternType || 0;
    const symmetry = designConfig.symmetry || 4;
    const complexity = designConfig.complexity || 2;
    const primaryColor = designConfig.colors?.primary || "#1890ff";
    const secondaryColor = designConfig.colors?.secondary || "#f0f5ff";
    const accentColor = designConfig.colors?.accent || "#096dd9";
    
    switch(patternType) {
      case 0:
        drawSpecialCross(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor);
        break;
      case 1:
        drawSierpinskiCarpet(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor, secondaryColor);
        break;
      case 2:
        drawSquareResonator(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor, secondaryColor);
        break;
      case 3:
        drawFishnet(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor, secondaryColor);
        break;
      case 4:
        drawSquareSpiral(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor, secondaryColor);
        break;
      case 5:
        drawNestedSquares(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor, secondaryColor);
        break;
      case 6:
        drawDoubleCOpening(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor, secondaryColor);
        break;
      case 7:
        drawGreekCross(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor, secondaryColor);
        break;
      default:
        drawSpecialCross(ctx, symmetry, complexity, f1, f2, f3, primaryColor, accentColor);
    }
    
    // 将Canvas转换为图片URL
    setPatternImage(canvas.toDataURL('image/png'));
  }, [designConfig]);

  // 当designConfig变化时，生成图案
  useEffect(() => {
    if (designConfig) {
      generatePattern();
    }
  }, [designConfig, generatePattern]);

  // 下载Logo功能
  const handleDownload = useCallback(async () => {
    if (logoRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(logoRef.current, {
        backgroundColor: designConfig?.colors?.secondary || "#f0f5ff",
        pixelRatio: 3 // 提高导出图片质量
      });

      const link = document.createElement('a');
      link.download = `bionic-logo.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('下载失败:', err);
    }
  }, [designConfig]);

  // 现在进行条件判断
  if (!designConfig) {
    return <div>正在准备Logo预览...</div>;
  }

  // 从 designConfig 中解构值，并提供默认值
  const { 
    layout = "1x1", 
    shape = "circle", 
    colors = { primary: "#1890ff", secondary: "#f0f5ff", accent: "#096dd9" },
    footerText = "Bionic Metamaterials",
    patternName = "特殊十字",
    symmetry = 4,
    complexity = 2,
  } = designConfig;

  if (!isClient) {
    return <div>正在准备Logo预览...</div>;
  }

  // 解析布局字符串，如 "2x3"
  const parseLayout = () => {
    const [rows, cols] = layout.split('x').map(Number);
    return { rows, cols, total: rows * cols };
  };

  // 渲染基元图案网格
  const renderPatternGrid = () => {
    const { rows, cols, total } = parseLayout();
    const cellSize = 200 / Math.max(rows, cols); // 根据行列数调整单元格大小
    
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '8px',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyItems: 'center'
      }}>
        {Array.from({ length: total }, (_, index) => (
          <div key={index} style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <svg width={cellSize} height={cellSize} viewBox={`0 0 40 40`}>
              {renderShape()}
            </svg>
          </div>
        ))}
      </div>
    );
  };

  // 根据形状生成不同的SVG路径
  const renderShape = (fillColor = colors.primary) => {
    const size = 40; // 单个基元的大小
    const center = size / 2;
    
    switch(shape) {
      case 'circle':
        return <circle cx={center} cy={center} r={center - 2} fill={fillColor} />;
      case 'square':
        return <rect x="2" y="2" width={size - 4} height={size - 4} fill={fillColor} rx="4" />;
      case 'triangle':
        return <polygon 
          points={`${center},2 ${size - 2},${size - 2} 2,${size - 2}`} 
          fill={fillColor} 
        />;
      case 'cross':
        return (
          <g fill={fillColor}>
            <rect x={center - 4} y="2" width="8" height={size - 4} />
            <rect x="2" y={center - 4} width={size - 4} height="8" />
          </g>
        );
      case 'grid':
        return (
          <g stroke={fillColor} strokeWidth="2" fill="none">
            <line x1="2" y1={center} x2={size - 2} y2={center} />
            <line x1={center} y1="2" x2={center} y2={size - 2} />
          </g>
        );
      case 'spiral':
        return (
          <path 
            d="M20,2 Q30,10 20,18 Q10,10 20,2" 
            fill="none" 
            stroke={fillColor} 
            strokeWidth="2"
          />
        );
      case 'cshape':
        return (
          <path 
            d="M30,10 C25,5 15,5 10,10 C5,15 5,25 10,30 C15,35 25,35 30,30" 
            fill="none" 
            stroke={fillColor} 
            strokeWidth="2"
          />
        );
      default:
        return <circle cx={center} cy={center} r={center - 2} fill={fillColor} />;
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div 
        ref={logoRef}
        style={{
          display: 'inline-block',
          backgroundColor: colors.secondary,
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '20px',
          width: '250px',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* 基元图案网格 */}
        <div style={{ width: '200px', height: '200px' }}>
          {patternImage ? (
            // 使用Next.js的Image组件替代img标签
            <Image 
              src={patternImage} 
              alt="Generated Pattern" 
              width={200}
              height={200}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.secondary,
              color: colors.primary,
              fontSize: '14px'
            }}>
              正在生成图案...
            </div>
          )}
        </div>
        
        {/* 底部文本 */}
        <div style={{ 
          marginTop: '10px',
          color: colors.accent,
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {footerText}
        </div>
      </div>
      
      <div>
        <Space>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleDownload}
            size="large"
          >
            下载Logo
          </Button>
        </Space>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>布局: {layout} | 图案: {patternName}</p>
        <p>对称性: {symmetry}重 | 复杂度: {complexity}级</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.primary,
              marginRight: '5px',
              borderRadius: '3px'
            }}></div>
            主色
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.secondary,
              marginRight: '5px',
              borderRadius: '3px'
            }}></div>
            背景色
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.accent,
              marginRight: '5px',
              borderRadius: '3px'
            }}></div>
            强调色
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoPreview;