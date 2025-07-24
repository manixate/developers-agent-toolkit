/* eslint-disable @typescript-eslint/no-require-imports */
const esbuild = require('esbuild');
const fsSync = require('fs');
const dxt = require('@anthropic-ai/dxt');
const packageJson = require('./package.json');

// Base build configuration
const config = {
  entryPoints: ['src/index.ts'],
  target: 'node18',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  minify: true,
  tsconfig: 'tsconfig.json',
  outfile: 'dxt/dist/index.js',
};

async function build() {
  try {
    const outDir = 'dxt/dist';

    console.log('🔨 Building DXT bundle with esbuild...');
    console.log('📦 Bundling all dependencies for standalone distribution');

    // Ensure output directory exists
    if (!fsSync.existsSync(outDir)) {
      fsSync.mkdirSync(outDir);
    }

    const result = await esbuild.build(config);

    if (result.errors.length > 0) {
      console.error('Build failed with errors:');
      result.errors.forEach((error) => console.error(error));
      throw new Error('Build failed with errors');
    }

    if (result.warnings.length > 0) {
      console.warn('Build completed with warnings:');
      result.warnings.forEach((warning) => console.warn(warning));
    }

    // Make the output file executable
    fsSync.chmodSync(config.outfile, '755');

    console.log('✅ Build completed successfully!');
    console.log(`Output: ${config.outfile}`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build();

const packageVersion = packageJson.version;
const dxtFilename = `mastercard-developers-mcp-${packageVersion}.dxt`;

console.log('📦 Creating DXT extension...');
dxt.packExtension({
  extensionPath: 'dxt',
  outputPath: dxtFilename,
  silent: true,
});

console.log('🎉 DXT extension built successfully');
console.log(`Output: ${dxtFilename}`);
