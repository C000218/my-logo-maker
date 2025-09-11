'use client';

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#fff5f5',
          border: '1px solid #feb2b2',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h2 style={{ color: '#c53030' }}>出了点问题</h2>
          <p>应用程序加载时出现错误。请刷新页面重试。</p>
          <details style={{ 
            whiteSpace: 'pre-wrap', 
            textAlign: 'left',
            backgroundColor: '#fed7d7',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <summary>错误详情</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;