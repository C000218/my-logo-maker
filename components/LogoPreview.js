'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';
import Image from 'next/image';

// 导入图案生成函数
import {
  drawSpecialCross,
  drawSierpinskiCarpet,
  drawSquareResonator,
  drawFishnet,
  drawSquareSpiral,
  drawNestedSquares,
  drawDoubleCOpening,
  drawGreekCross
} from '@/lib/patternGenerators';

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
            d="M30,10 C25,5 15,5 10,10 C5,15 极速版5,25 10,30 C15,35 25,35 30,30" 
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