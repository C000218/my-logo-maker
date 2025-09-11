
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许开发环境下的跨源请求
  allowedDevOrigins: [
    '192.168.36.1', // 您当前的 IP 地址
    'localhost',    // 本地主机
    '127.0.0.1',    // 本地回环地址
  ],
  
  // 其他现有配置保持不变
  // 如果您有其他配置，请确保保留它们
  
  // 可选：如果您使用的是 Next.js 15+，可能需要添加以下配置
  experimental: {
    allowedDevOrigins: [
      '192.168.36.1',
      'localhost',
      '127.0.0.1',
    ],
  },
}

module.exports = nextConfig