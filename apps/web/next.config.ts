import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@indexfolio/knowledge-graph',
    '@indexfolio/tax-engine',
    '@indexfolio/etf-types',
  ],
}

export default nextConfig
