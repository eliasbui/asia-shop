import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use serverExternalPackages instead of the deprecated option
  serverExternalPackages: [],
  
  // Add onDemandEntries configuration to fix HMR ping issues
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
};

export default nextConfig;
