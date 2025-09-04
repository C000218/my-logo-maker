'use client';

import { useRef, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';

const LogoPreview = ({ designConfig }) => {
  const logoRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果没有设计配置或设计配置不完整，显示加载状态
  if (!designConfig || !designConfig.text) {
    return <div>正在准备Logo预览...</div>;
  }

  // 从 designConfig 中解构值，并提供默认值
  const { 
    text = "", 
    shape = "circle", 
    colors = { primary: "#1890ff", secondary: "#f0f5ff", accent: "#096dd9" }, 
    icon = "star", 
    style = { layout: "centered", complexity: "simple" }
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
      link.download = `${text || "logo"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  if (!isClient) {
    return <div>正在准备Logo预览...</div>;
  }

  // 根据形状生成不同的SVG路径
  const renderShape = () => {
    const size = 200;
    const center = size / 2;
    
    switch(shape) {
      case 'circle':
        return <circle cx={center} cy={center} r={center - 10} fill={colors.primary} />;
      case 'square':
        return <rect x="10" y="10" width={size - 20} height={size - 20} fill={colors.primary} rx="15" />;
      case 'triangle':
        return <polygon 
          points={`${center},10 ${size - 10},${size - 10} 10,${size - 10}`} 
          fill={colors.primary} 
        />;
      case 'heart':
        return <path 
          d={`M${center},${center - 40} C${center + 60},${center - 80} ${center + 80},${center - 20} ${center},${center + 40} C${center - 80},${center - 20} ${center - 60},${center - 80} ${center},${center - 40}`} 
          fill={colors.primary} 
        />;
      case 'star':
        return <path 
          d={`M${center},10 L${center + 20},${center - 20} L${center + 40},${center - 10} L${center + 30},${center + 10} L${center + 40},${center + 30} L${center},${center + 20} L${center - 40},${center + 30} L${center - 30},${center + 10} L${center - 40},${center - 10} L${center - 20},${center - 20} Z`} 
          fill={colors.primary} 
        />;
      default:
        return <circle cx={center} cy={center} r={center - 10} fill={colors.primary} />;
    }
  };

  // 根据布局决定文字排列方式
  const renderText = () => {
    // 确保 text 有值
    const displayText = text || "";
    
    switch(style.layout) {
      case 'side-by-side':
        return (
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dy="0.3em" 
            fill={colors.accent}
            fontSize="32"
            fontWeight="bold"
          >
            {displayText}
          </text>
        );
      case 'stacked':
        // 确保 text 有值再调用 split
        return displayText.split('').map((char, index) => (
          <text 
            key={index}
            x="50%" 
            y={`${40 + index * 30}%`} 
            textAnchor="middle" 
            fill={colors.accent}
            fontSize="28"
            fontWeight="bold"
          >
            {char}
          </text>
        ));
      case 'centered':
      default:
        return (
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dy="0.3em" 
            fill={colors.accent}
            fontSize="40"
            fontWeight="bold"
          >
            {displayText}
          </text>
        );
    }
  };

  // 简单图标映射
  const renderIcon = () => {
    if (!icon || icon === 'none') return null;
    
    const iconSize = 30;
    const iconY = style.layout === 'stacked' ? 75 : 50;
    
    // 这里可以扩展更多图标
    switch(icon) {
      case 'heart':
        return <path 
          d={`M${100 - iconSize/2},${iconY - iconSize/2} C${100 + iconSize/2},${iconY - iconSize} ${100 + iconSize},${iconY - iconSize/4} ${100},${iconY + iconSize/2} C${100 - iconSize},${iconY - iconSize/4} ${100 - iconSize/2},${iconY - iconSize} ${100 - iconSize/2},${iconY - iconSize/2}`} 
          fill={colors.accent} 
        />;
      case 'star':
        return <path 
          d={`M${100},${iconY - iconSize} L${100 + iconSize/4},${iconY - iconSize/4} L${100 + iconSize},${iconY} L${100 + iconSize/4},${iconY + iconSize/4} L${100},${iconY + iconSize} L${100 - iconSize/4},${iconY + iconSize/4} L${100 - iconSize},${iconY} L${100 - iconSize/4},${iconY - iconSize/4} Z`} 
          fill={colors.accent} 
        />;
      default:
        return <circle cx="100" cy={iconY} r={iconSize/3} fill={colors.accent} />;
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div 
        ref={logoRef}
        style={{
          display: 'inline-block',
          backgroundColor: colors.secondary,
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}
      >
        <svg 
          width="200" 
          height="200" 
          viewBox="0 0 200 200"
          style={{ display: 'block' }}
        >
          {renderShape()}
          {renderText()}
          {renderIcon()}
        </svg>
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
        <p>形状: {shape} | 布局: {style.layout} | 图标: {icon || '无'}</p>
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