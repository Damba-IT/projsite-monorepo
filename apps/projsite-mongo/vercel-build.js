#!/usr/bin/env node

// Custom build script for Vercel deployment
// This script ensures shared packages from the monorepo are properly bundled

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const projectRoot = process.cwd();
const monorepoRoot = path.resolve(projectRoot, '../..');
const distDir = path.join(projectRoot, 'dist');
const packagesDir = path.join(monorepoRoot, 'packages');

console.log('🏗️ Starting custom Vercel build...');

// Build the project
console.log('📦 Building main application...');
execSync('bun build src/index.ts --outdir dist --target node --format esm', { 
  stdio: 'inherit',
  cwd: projectRoot
});

// Make sure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create a packages directory in dist for shared packages
const distPackagesDir = path.join(distDir, 'node_modules', '@projsite');
if (!fs.existsSync(distPackagesDir)) {
  fs.mkdirSync(distPackagesDir, { recursive: true });
}

// Copy shared packages into the dist directory
console.log('📦 Copying shared packages...');
['projsite-types', 'projsite-auth'].forEach(packageName => {
  const shortName = packageName.replace('projsite-', '');
  const srcPackageDir = path.join(packagesDir, packageName);
  const destPackageDir = path.join(distPackagesDir, shortName);
  
  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(destPackageDir)) {
    fs.mkdirSync(destPackageDir, { recursive: true });
  }
  
  // Copy package.json
  const packageJsonPath = path.join(srcPackageDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    fs.copyFileSync(packageJsonPath, path.join(destPackageDir, 'package.json'));
  }
  
  // Copy dist directory if it exists
  const srcDistDir = path.join(srcPackageDir, 'dist');
  const destDistDir = path.join(destPackageDir, 'dist');
  if (fs.existsSync(srcDistDir)) {
    if (!fs.existsSync(destDistDir)) {
      fs.mkdirSync(destDistDir, { recursive: true });
    }
    
    // Copy all files from dist directory
    fs.readdirSync(srcDistDir).forEach(file => {
      fs.copyFileSync(
        path.join(srcDistDir, file),
        path.join(destDistDir, file)
      );
    });
  }
});

console.log('✅ Build completed successfully!'); 