import type { NextConfig } from 'next'

// Security headers applied to every route. Set here rather than in vercel.json so
// they are portable: they apply in local dev, on Vercel, and anywhere we might
// self-host. No Content-Security-Policy yet - a correct CSP for three.js / recharts
// / inline styles is a focused effort of its own and is deliberately left for later.
const securityHeaders = [
  // Force HTTPS for two years, including subdomains (staging + api are all HTTPS).
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  // Stop the browser from MIME-sniffing a response away from its declared type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // The app is never embedded in a frame, so deny it (clickjacking protection).
  { key: 'X-Frame-Options', value: 'DENY' },
  // Send only the origin on cross-origin requests; full URL stays same-origin.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Turn off powerful features we do not use, and opt out of the Topics API.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
]

const nextConfig: NextConfig = {
  transpilePackages: [
    '@indexfolio/knowledge-graph',
    '@indexfolio/tax-engine',
    '@indexfolio/etf-types',
  ],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  // Permanent apex -> www redirect so search engines consolidate on one host.
  // Only fires if Vercel lets non-www reach the app, not an edge redirect.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'indexfolio.dev' }],
        destination: 'https://www.indexfolio.dev/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
