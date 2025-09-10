'use client';

import { useRef, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';

const LogoPreview = ({ designConfig }) => {
  const logoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [patternImage, setPatternImage] = useState(null);

  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 当designConfig变化时，生成图案
  useEffect(() => {
    if (designConfig && designConfig.patternType !== undefined) {
      generatePattern();
    }
  }, [designConfig]);

  // 如果没有设计配置，显示加载状态
  if (!designConfig) {
    return <div>正在准备Logo预览...</div>;
  }

  // 从 designConfig 中解构值，并提供默认值
  const { 
    layout = "1x1", 
    shape = "circle", 
    colors = { primary: "#1890ff", secondary: "#f0f5ff", accent: "#096dd9" },
    footerText = "Bionic Metamaterials",
    patternType = 0,
    symmetry = 4,
    complexity = 2,
    features = [5, 5, 5]
  } = designConfig;

  // 生成图案
  const generatePattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置背景色
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 根据图案类型绘制不同的图案
    switch(patternType) {
      case 0:
        drawSpecialCross(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
        break;
      case 1:
        drawSierpinskiCarpet(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
        break;
      case 2:
        drawSquareResonator(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
        break;
      case 3:
        drawFishnet(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
        break;
      case 4:
        drawSquareSpiral(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
        break;
      case 5:
        drawNestedSquares(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
        break;
      case 6:
        drawDoubleCOpening(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
        break;
      case 7:
        drawGreekCross(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
        break;
      default:
        drawSpecialCross(ctx, symmetry, complexity, features[0], features[1], features[2], colors.primary, colors.accent);
    }
    
    // 将Canvas转换为图片URL
    setPatternImage(canvas.toDataURL('image/png'));
  };

  // 下载Logo功能
  const handleDownload = async () => {
    if (logoRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(logoRef.current, {
        backgroundColor: colors.secondary,
        pixelRatio: 3 // 提高导出图片质量
      });

      const link = document.createElement('a');
      link.download = `bionic-logo.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  if (!isClient) {
    return <div>正在准备Logo预览...</div>;
  }

  // 图案绘制函数
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

  // 其他图案绘制函数（这里只实现了第一个，其余需要类似实现）
  const drawSierpinskiCarpet = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
    // 实现谢尔宾斯基地毯图案
    ctx.fillStyle = primaryColor;
    ctx.fillRect(40, 40, 120, 120);
    
    // 这里简化实现，实际应根据复杂度等参数绘制分形图案
    for (let i = 0; i < complexity; i++) {
      const size = 120 / Math.pow(3, i);
      for (let x = 40; x < 160; x += size * 3) {
        for (let y = 40; y < 160; y += size * 3) {
          ctx.clearRect(x + size, y + size, size, size);
        }
      }
    }
  };

  // 其他图案绘制函数（简化实现）
  const drawSquareResonator = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 100, 100);
    ctx.strokeRect(70, 70, 60, 60);
    
    // 添加缺口
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(145, 90, 10, 20);
    ctx.fillRect(45, 90, 10, 20);
  };

  const drawFishnet = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    
    // 绘制网格
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(40, 40 + i * 12);
      ctx.lineTo(160, 40 + i * 12);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(40 + i * 12, 40);
      ctx.lineTo(40 + i * 12, 160);
      ctx.stroke();
    }
  };

  const drawSquareSpiral = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    
    let x = 100, y = 100;
    let size = 80;
    
    ctx.beginPath();
    ctx.moveTo(x - size/2, y - size/2);
    
    for (let i = 0; i < complexity + 2; i++) {
      ctx.lineTo(x + size/2, y - size/2);
      ctx.lineTo(x + size/2, y + size/2);
      ctx.lineTo(x - size/2, y + size/2);
      ctx.lineTo(x - size/2, y - size/2 + 10);
      
      size -= 20;
    }
    
    ctx.stroke();
  };

  const drawNestedSquares = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
    ctx.strokeStyle = primaryColor;
    
    for (let i = 0; i < complexity + 2; i++) {
      ctx.lineWidth = 3 - i * 0.4;
      const size = 100 - i * 15;
      ctx.strokeRect(100 - size/2, 100 - size/2, size, size);
    }
  };

  const drawDoubleCOpening = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 6 + complexity;
    
    // 左侧C
    ctx.beginPath();
    ctx.arc(70, 100, 40, -Math.PI/2, Math.PI/2, false);
    ctx.stroke();
    
    // 右侧C
    ctx.beginPath();
    ctx.arc(130, 100, 40, Math.PI/2, -Math.PI/2, false);
    ctx.stroke();
  };

  const drawGreekCross = (ctx, symmetry, complexity, f1, f2, f3, primaryColor, secondaryColor) => {
    ctx.fillStyle = primaryColor;
    
    // 水平臂
    ctx.fillRect(60, 80, 80, 40);
    
    // 垂直臂
    ctx.fillRect(80, 60, 40, 80);
  };

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
      case 'heart':
        return <path 
          d={`M${center},${center - 8} C${center + 12},${center - 16} ${center + 16},${center - 4} ${center},${center + 8} C${center - 16},${center - 4} ${center - 12},${center - 16} ${center},${center - 8}`} 
          fill={fillColor} 
        />;
      case 'star':
        return <path 
          d={`M${center},2 L${center + 4},${center - 4} L${center + 8},${center - 2} L${center + 6},${center + 2} L${center + 8},${center + 6} L${center},${center + 4} L${center - 8},${center + 6} L${center - 6},${center + 2} L${center - 8},${center - 2} L${center - 4},${center - 4} Z`} 
          fill={fillColor} 
        />;
      case 'diamond':
        return <polygon 
          points={`${center},2 ${size - 2},${center} ${center},${size - 2} 2,${center}`} 
          fill={fillColor} 
        />;
      case 'pentagon':
        return <polygon 
          points={`${center},2 ${size - 2},${center - 4} ${size - 4},${size - 2} 4,${size - 2} 2,${center - 4}`} 
          fill={fillColor} 
        />;
      case 'hexagon':
        return <polygon 
          points={`${center - 8},2 ${center + 8},2 ${size - 2},${center} ${center + 8},${size - 2} ${center - 8},${size - 2} 2,${center}`} 
          fill={fillColor} 
        />;
      case 'cloud':
        return <path 
          d={`M${center - 10},${center} C${center - 12},${center - 6} ${center - 8},${center - 10} ${center},${center - 10} C${center + 8},${center - 10} ${center + 12},${center - 6} ${center + 10},${center} C${center + 14},${center} ${center + 16},${center + 4} ${center + 12},${center + 8} C${center + 8},${center + 12} ${center + 4},${center + 14} ${center},${center + 14} C${center - 4},${center + 14} ${center - 8},${center + 12} ${center - 12},${center + 8} C${center - 16},${center + 4} ${center - 14},${center} ${center - 10},${center} Z`} 
          fill={fillColor} 
        />;
      case 'leaf':
        return <path 
          d={`M${center},2 C${center - 4},${center - 4} ${center - 12},${center - 6} ${center - 14},${center} C${center - 16},${center + 6} ${center - 10},${center + 12} ${center},${size - 2} C${center + 10},${center + 12} ${center + 16},${center + 6} ${center + 14},${center} C${center + 12},${center - 6} ${center + 4},${center - 4} ${center},2 Z`} 
          fill={fillColor} 
        />;
      case 'moon':
        return <path 
          d={`M${center},2 C${center + 8},2 ${center + 14},8 ${center + 14},${center} C${center + 14},${center + 8} ${center + 8},${size - 2} ${center},${size - 2} C${center - 4},${size - 2} ${center - 8},${size - 6} ${center - 8},${center} C${center - 8},${center - 6} ${center - 4},2 ${center},2 Z`} 
          fill={fillColor} 
        />;
      case 'snowflake':
        return <path 
          d={`M${center},2 L${center},${size - 2} M${center - 8},${center - 8} L${center + 8},${center + 8} M${center - 8},${center + 8} L${center + 8},${center - 8} M2,${center} L${size - 2},${center}`} 
          stroke={fillColor} 
          strokeWidth="2" 
          fill="none" 
        />;
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
            <img src={patternImage} alt="Generated Pattern" style={{ width: '100%', height: '100%' }} />
          ) : (
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              style={{ display: 'none' }}
            />
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
        <p>布局: {layout} | 形状: {shape}</p>
        <p>图案类型: {patternType} | 对称性: {symmetry}重 | 复杂度: {complexity}级</p>
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