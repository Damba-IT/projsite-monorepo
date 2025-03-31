import { build } from 'bun';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Building for Vercel deployment...');

// Bundle everything into a single file for Vercel
const result = await build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'node',
  format: 'esm',
  // We need to include all shared packages directly
  external: ['mongodb'],
  // Force bun to include @projsite/* packages
  plugins: [{
    name: 'inline-projsite-packages',
    setup(build) {
      build.onResolve({ filter: /^@projsite\/.*/ }, args => {
        console.log(`🔍 Resolving shared package: ${args.path}`);
        // Don't mark it as external
        return null;
      });
    }
  }]
});

console.log('✅ Build output:');
console.log(result);

// Copy API handler to dist
fs.copyFileSync('./api/index.js', './dist/api.js');

console.log('📝 Creating a package.json in dist');
// Create a package.json in dist for Node.js module resolution
const packageJson = {
  "type": "module",
  "main": "index.js"
};
fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));

console.log('✅ Build completed successfully!'); 