import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@indexfolio/knowledge-graph',
    '@indexfolio/tax-engine',
    '@indexfolio/etf-types',
  ],
}

export default nextConfig
