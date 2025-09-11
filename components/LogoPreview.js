'use client';

import { useRef, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';
import { patternNames } from '@/lib/patternUtils';

const LogoPreview = ({ designConfig, initials }) => {
  const logoRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果没有设计配置，显示加载状态
  if (!designConfig) {
    return <div>正在准备Logo预览...</div>;
  }

  // 从 designConfig 中解构值，并提供默认值
  const { 
    layout = "1x1", 
    patternType = 0,
    symmetry = 4,
    complexity = 2,
    feature1 = 0,
    feature2 = 0,
    feature3 = 0,
    colors = { primary: "#1890ff", secondary: "#f0f5ff", accent: "#096dd9" },
    footerText = "Bionic Metamaterials"
  } = designConfig;

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
      link.download = `bionic-logo-${initials || 'design'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  if (!isClient) {
    return <div>正在准备Logo预览...</div>;
  }

  // 特殊十字图案
  const renderSpecialCross = (symmetry, complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const branchLength = 40 + 5 * complexity;
    const branchWidth = 4 + complexity;
    const secondaryRatio = 0.4 + 0.2 * f2 / 10;
    const secondaryLength = branchLength * secondaryRatio;
    const secondaryWidth = branchWidth * 0.7;
    const centerSize = 5 + f3;
    
    return (
      <g>
        {/* 主分支 */}
        <line x1={centerX} y1={centerY} x2={centerX} y2={centerY + branchLength} 
              stroke={colors.primary} strokeWidth={branchWidth} />
        <line x1={centerX} y1={centerY} x2={centerX} y2={centerY - branchLength} 
              stroke={colors.primary} strokeWidth={branchWidth} />
        <line x1={centerX} y1={centerY} x2={centerX + branchLength} y2={centerY} 
              stroke={colors.primary} strokeWidth={branchWidth} />
        <line x1={centerX} y1={centerY} x2={centerX - branchLength} y2={centerY} 
              stroke={colors.primary} strokeWidth={branchWidth} />
        
        {/* 次级分支 */}
        <line x1={centerX} y1={centerY + branchLength} x2={centerX + secondaryLength} y2={centerY + branchLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX} y1={centerY + branchLength} x2={centerX - secondaryLength} y2={centerY + branchLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX} y1={centerY - branchLength} x2={centerX + secondaryLength} y2={centerY - branchLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX} y1={centerY - branchLength} x2={centerX - secondaryLength} y2={centerY - branchLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX + branchLength} y1={centerY} x2={centerX + branchLength} y2={centerY + secondaryLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX + branchLength} y1={centerY} x2={centerX + branchLength} y2={centerY - secondaryLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX - branchLength} y1={centerY} x2={centerX - branchLength} y2={centerY + secondaryLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX - branchLength} y1={centerY} x2={centerX - branchLength} y2={centerY - secondaryLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        
        {/* 中心点 */}
        <circle cx={centerX} cy={centerY} r={centerSize} fill="gold" stroke="black" />
        
        {/* 额外分支（如果复杂度高） */}
        {complexity > 3 && f3 > 7 && (
          [...Array(4)].map((_, i) => {
            const angle = 45 + i * 90;
            const tertiaryLength = branchLength * 0.3;
            const endX = centerX + tertiaryLength * Math.cos(angle * Math.PI / 180);
            const endY = centerY + tertiaryLength * Math.sin(angle * Math.PI / 180);
            return (
              <line key={i} x1={centerX} y1={centerY} x2={endX} y2={endY} 
                    stroke={colors.primary} strokeWidth={branchWidth * 0.5} />
            );
          })
        )}
      </g>
    );
  };

  // 谢尔宾斯基地毯
  const renderSierpinskiCarpet = (symmetry, complexity, f1, f2, f3, colors) => {
    // 简化的谢尔宾斯基地毯实现
    const size = 100;
    const level = Math.min(complexity, 3);
    
    const drawSierpinski = (x, y, size, level) => {
      if (level === 0) return null;
      
      const newSize = size / 3;
      const elements = [];
      
      // 中心空洞
      elements.push(
        <rect key={`${x}-${y}`} x={x + newSize} y={y + newSize} width={newSize} height={newSize} 
              fill={colors.secondary} stroke={colors.secondary} />
      );
      
      // 递归绘制8个周边区域
      if (level > 1) {
        const positions = [
          [x, y], [x + newSize, y], [x + 2 * newSize, y],
          [x, y + newSize], [x + 2 * newSize, y + newSize],
          [x, y + 2 * newSize], [x + newSize, y + 2 * newSize], [x + 2 * newSize, y + 2 * newSize]
        ];
        
        positions.forEach(([posX, posY]) => {
          elements.push(...drawSierpinski(posX, posY, newSize, level - 1));
        });
      }
      
      return elements;
    };
    
    return (
      <g>
        <rect x="50" y="50" width={size} height={size} fill={colors.primary} />
        {drawSierpinski(50, 50, size, level)}
      </g>
    );
  };

  // 方形谐振环
  const renderSquareResonator = (symmetry, complexity, f1, f2, f3, colors) => {
    const outerSize = 80;
    const innerSize = 50;
    const thickness = 8 + complexity * 2;
    
    return (
      <g>
        {/* 外环 */}
        <rect x={100 - outerSize/2} y={100 - outerSize/2} 
              width={outerSize} height={outerSize} 
              fill="none" stroke={colors.primary} strokeWidth={thickness} />
        
        {/* 内环 */}
        <rect x={100 - innerSize/2} y={100 - innerSize/2} 
              width={innerSize} height={innerSize} 
              fill="none" stroke={colors.primary} strokeWidth={thickness/2} />
        
        {/* 缺口 */}
        <line x1={100 + outerSize/2 - 10} y1={100 - 5} 
              x2={100 + outerSize/2 - 10} y2={100 + 5} 
              stroke={colors.secondary} strokeWidth={thickness + 2} />
        
        <line x1={100 - outerSize/2 + 10} y1={100 - 5} 
              x2={100 - outerSize/2 + 10} y2={100 + 5} 
              stroke={colors.secondary} strokeWidth={thickness + 2} />
      </g>
    );
  };

  // 鱼网状图案
  const renderFishnet = (symmetry, complexity, f1, f2, f3, colors) => {
    const size = 150;
    const gridSize = 10 + complexity * 2;
    const strokeWidth = 1 + complexity / 2;
    
    return (
      <g>
        {Array.from({ length: gridSize }).map((_, i) => (
          <g key={i}>
            <line 
              x1={25 + (i * size / gridSize)} 
              y1={25} 
              x2={25 + (i * size / gridSize)} 
              y2={25 + size} 
              stroke={colors.primary} 
              strokeWidth={strokeWidth} 
            />
            <line 
              x1={25} 
              y1={25 + (i * size / gridSize)} 
              x2={25 + size} 
              y2={25 + (i * size / gridSize)} 
              stroke={colors.primary} 
              strokeWidth={strokeWidth} 
            />
          </g>
        ))}
      </g>
    );
  };

  // 方形螺旋
  const renderSquareSpiral = (symmetry, complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const maxSize = 80;
    const turns = 3 + complexity;
    const segments = 4 * turns;
    const points = [];
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const size = maxSize * t;
      const angle = (Math.PI / 2) * i;
      
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);
      
      points.push(`${x},${y}`);
    }
    
    return (
      <polyline 
        points={points.join(' ')} 
        fill="none" 
        stroke={colors.primary} 
        strokeWidth={3 + complexity / 2} 
      />
    );
  };

  // 嵌套方形
  const renderNestedSquares = (symmetry, complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const maxSize = 80;
    const squaresCount = 3 + complexity;
    
    return (
      <g>
        {Array.from({ length: squaresCount }).map((_, i) => {
          const size = maxSize - (i * maxSize / squaresCount);
          return (
            <rect 
              key={i}
              x={centerX - size/2} 
              y={centerY - size/2} 
              width={size} 
              height={size} 
              fill="none" 
              stroke={colors.primary} 
              strokeWidth={2 + i} 
            />
          );
        })}
      </g>
    );
  };

  // 双C开口图案 - 根据Python代码修复
  const renderDoubleCOpening = (symmetry, complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const size = 40 + complexity * 5;
    const halfSize = size / 2;
    const gapSize = size / 2; // 开口长度为边长的一半
    const lineWidth = 5 + complexity; // 线宽
    
    // 左侧C型（开口向左朝外）
    const leftCenterX = centerX - halfSize;
    
    // 右侧C型（开口向右朝外）
    const rightCenterX = centerX + halfSize;
    
    return (
      <g>
        {/* 左侧C型（开口向左朝外） */}
        {/* 上横线（缩短一半，从中心到右侧） */}
        <line 
          x1={leftCenterX} 
          y1={centerY + halfSize} 
          x2={leftCenterX + halfSize} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 下横线（缩短一半，从中心到右侧） */}
        <line 
          x1={leftCenterX} 
          y1={centerY - halfSize} 
          x2={leftCenterX + halfSize} 
          y2={centerY - halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 右侧竖线（完整） */}
        <line 
          x1={leftCenterX + halfSize} 
          y1={centerY - halfSize} 
          x2={leftCenterX + halfSize} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 左侧开口线（与缩短线连接） */}
        <line 
          x1={leftCenterX} 
          y1={centerY - halfSize} 
          x2={leftCenterX} 
          y2={centerY - gapSize/2} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        <line 
          x1={leftCenterX} 
          y1={centerY + gapSize/2} 
          x2={leftCenterX} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        
        {/* 右侧C型（开口向右朝外） */}
        {/* 上横线（缩短一半，从中心到左侧） */}
        <line 
          x1={rightCenterX} 
          y1={centerY + halfSize} 
          x2={rightCenterX - halfSize} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 下横线（缩短一半，从中心到左侧） */}
        <line 
          x1={rightCenterX} 
          y1={centerY - halfSize} 
          x2={rightCenterX - halfSize} 
          y2={centerY - halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 左侧竖线（完整） */}
        <line 
          x1={rightCenterX - halfSize} 
          y1={centerY - halfSize} 
          x2={rightCenterX - halfSize} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 右侧开口线（与缩短线连接） */}
        <line 
          x1={rightCenterX} 
          y1={centerY - halfSize} 
          x2={rightCenterX} 
          y2={centerY - gapSize/2} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        <line 
          x1={rightCenterX} 
          y1={centerY + gapSize/2} 
          x2={rightCenterX} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
      </g>
    );
  };

  // 希腊十字
  const renderGreekCross = (symmetry, complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const armLength = 30 + complexity * 5;
    const armWidth = 8 + complexity;
    
    return (
      <g>
        {/* 垂直臂 */}
        <rect 
          x={centerX - armWidth/2} 
          y={centerY - armLength} 
          width={armWidth} 
          height={armLength * 2} 
          fill={colors.primary} 
        />
        
        {/* 水平臂 */}
        <rect 
          x={centerX - armLength} 
          y={centerY - armWidth/2} 
          width={armLength * 2} 
          height={armWidth} 
          fill={colors.primary} 
        />
        
        {/* 装饰（如果复杂度高） */}
        {complexity > 3 && (
          <circle cx={centerX} cy={centerY} r={armWidth/2 + 2} fill={colors.accent} />
        )}
      </g>
    );
  };

  // 根据图案类型选择渲染函数
  const renderPattern = () => {
    switch(patternType) {
      case 0:
        return renderSpecialCross(symmetry, complexity, feature1, feature2, feature3, colors);
      case 1:
        return renderSierpinskiCarpet(symmetry, complexity, feature1, feature2, feature3, colors);
      case 2:
        return renderSquareResonator(symmetry, complexity, feature1, feature2, feature3, colors);
      case 3:
        return renderFishnet(symmetry, complexity, feature1, feature2, feature3, colors);
      case 4:
        return renderSquareSpiral(symmetry, complexity, feature1, feature2, feature3, colors);
      case 5:
        return renderNestedSquares(symmetry, complexity, feature1, feature2, feature3, colors);
      case 6:
        return renderDoubleCOpening(symmetry, complexity, feature1, feature2, feature3, colors);
      case 7:
        return renderGreekCross(symmetry, complexity, feature1, feature2, feature3, colors);
      default:
        return renderSpecialCross(symmetry, complexity, feature1, feature2, feature3, colors);
    }
  };

  // 根据名字缩写长度确定布局
  const getLayout = () => {
    // 如果 initials 是2个字母，使用2x2布局
    if (initials && initials.length === 2) {
      return "2x2";
    }
    // 否则使用配置的布局
    return layout;
  };

  // 解析布局字符串，如 "2x3"
  const parseLayout = () => {
    const effectiveLayout = getLayout();
    const [rows, cols] = effectiveLayout.split('x').map(Number);
    return { rows: rows || 1, cols: cols || 1, total: (rows || 1) * (cols || 1) };
  };

  // 渲染基元图案网格
  const renderPatternGrid = () => {
    const { rows, cols, total } = parseLayout();
    const cellSize = 200 / Math.max(rows, cols, 1);
    
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '1px', // 进一步减少间隔到1px
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
            <svg width={cellSize} height={cellSize} viewBox="0 0 200 200">
              {renderPattern()}
            </svg>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div 
        ref={logoRef}
        style={{
          display: 'inline-block',
          backgroundColor: colors.secondary,
          padding: '15px', // 进一步减少内边距
          borderRadius: '8px',
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
        <div style={{ width: '210px', height: '210px' }}> {/* 稍微增加内部容器大小 */}
          {renderPatternGrid()}
        </div>
        
        {/* 底部文本 */}
        <div style={{ 
          marginTop: '5px', // 进一步减少上边距
          color: colors.accent,
          fontSize: '11px', // 稍微减小字体大小
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
      
      <div style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>
        <p>图案: {patternNames[patternType] || "特殊十字"} | 对称性: {symmetry}重 | 复杂度: {complexity}级</p>
        <p>布局: {getLayout()}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '14px',
              height: '14px',
              backgroundColor: colors.primary,
              marginRight: '4px',
              borderRadius: '2px'
            }}></div>
            主色
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '14px',
              height: '14px',
              backgroundColor: colors.secondary,
              marginRight: '4px',
              borderRadius: '2px'
            }}></div>
            背景色
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '14px',
              height: '14px',
              backgroundColor: colors.accent,
              marginRight: '4px',
              borderRadius: '2px'
            }}></div>
            强调色
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoPreview;