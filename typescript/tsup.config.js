import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/modelcontextprotocol/index.ts'],
    outDir: 'mcp',
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
]);
