'use client';

import { useRef, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';
import { patternNames } from '@/lib/patternUtils';

const LogoPreview = ({ designConfig }) => {
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

  // 特殊十字图案
  const renderSpecialCross = (symmetry, complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const branchLength = 40 + 5 * complexity;
    const branchWidth = 4 + complexity;
    const branchAngle = 10 * f1 / 10;
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

  // 其他图案渲染函数（这里只实现了特殊十字，其他图案需要类似实现）
  const renderSierpinskiCarpet = (symmetry, complexity, f1, f2, f3, colors) => {
    // 实现谢尔宾斯基地毯
    return (
      <g>
        <rect x="50" y="50" width="100" height="100" fill={colors.primary} />
        <rect x="75" y="75" width="50" height="50" fill={colors.secondary} />
        <text x="100" y="100" textAnchor="middle" fill={colors.accent}>
          谢尔宾斯基地毯
        </text>
      </g>
    );
  };

  const renderSquareResonator = (symmetry, complexity, f1, f2, f3, colors) => {
    // 实现方形谐振环
    return (
      <g>
        <rect x="50" y="50" width="100" height="100" fill="none" stroke={colors.primary} strokeWidth="4" />
        <rect x="60" y="60" width="80" height="80" fill="none" stroke={colors.primary} strokeWidth="2" />
        <text x="100" y="100" textAnchor="middle" fill={colors.accent}>
          方形谐振环
        </text>
      </g>
    );
  };

  // 其他图案函数类似实现...

  // 解析布局字符串，如 "2x3"
  const parseLayout = () => {
    const [rows, cols] = layout.split('x').map(Number);
    return { rows, cols, total: rows * cols };
  };

  // 渲染基元图案网格
  const renderPatternGrid = () => {
    const { rows, cols, total } = parseLayout();
    const cellSize = 200 / Math.max(rows, cols);
    
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
          {renderPatternGrid()}
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
        <p>图案: {patternNames[patternType] || "特殊十字"} | 对称性: {symmetry}重 | 复杂度: {complexity}级</p>
        <p>布局: {layout}</p>
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