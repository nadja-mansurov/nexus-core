//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const path = require('path');
const FINANCE_APP_URL = process.env.FINANCE_APP_URL || 'http://localhost:3001';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},// 1. Tell Next to transpile the local library
  transpilePackages: ['@shared/shared-utils'],
  
  // 2. Explicitly map the alias for Turbopack
  experimental: {
    // @ts-ignore - Bypass type check for turbo property
    turbo: {
      resolveAlias: {
        // Use path.join with __dirname to create an absolute path
        '@shared/shared-utils': path.join(__dirname, '../../libs/shared-utils/src/index.ts'),
        '@shared/ui-shared': path.join(__dirname, '../../libs/ui-shared/src/index.ts'),
      },
    },
  },
  async rewrites() {
    return [
      {
        // When user goes to /finance...
        source: '/finance',
        // ...proxy them to the finance app's /finance route
        destination: `${FINANCE_APP_URL}/finance`,
      },
      {
        source: '/finance/:path*',
        destination: `${FINANCE_APP_URL}/finance/:path*`,
      },
    ];
  },
};

// composePlugins allows you to wrap your config with Nx's logic 
// and any other plugins like withSentry or withBundleAnalyzer
module.exports = composePlugins(withNx)(nextConfig);