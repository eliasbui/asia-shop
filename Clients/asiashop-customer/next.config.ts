import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable problematic features that can cause HMR issues
    serverComponentsExternalPackages: [],
  },
  // Optimize dev experience
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  // Add onDemandEntries configuration to fix HMR ping issues
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
};

export default nextConfig;
