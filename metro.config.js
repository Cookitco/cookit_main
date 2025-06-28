const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for TypeScript path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

// Ensure TypeScript files are resolved
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;