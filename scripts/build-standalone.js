#!/usr/bin/env node

/**
 * Build script to create a standalone bundle of the mnemonic library
 * This bundles all dependencies into a single file for offline use
 */

import esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function buildBundle(minify = false) {
    const suffix = minify ? '.min' : '';
    const outfile = join(rootDir, 'public', `mnemonic.standalone${suffix}.js`);

    console.log(`Building ${minify ? 'minified' : 'readable'} standalone bundle...`);

    const result = await esbuild.build({
        entryPoints: [join(rootDir, 'src', 'index.js')],
        bundle: true,
        format: 'esm',
        target: 'es2020',
        outfile: outfile,
        minify: minify,
        sourcemap: false,
        define: {
            'process.env.NODE_ENV': '"production"'
        },
        resolveExtensions: ['.js', '.mjs', '.cjs'],
        loader: {
            '.js': 'js'
        },
        banner: {
            js: `/**
 * Scintilla Network BIP39 Mnemonic Library - Standalone Bundle${minify ? ' (Minified)' : ''}
 * Generated: ${new Date().toISOString()}
 * This file contains all dependencies bundled for offline use
 * Compatible with modern browsers and Node.js environments
 */`
        }
    });

    const stats = await import('fs').then(fs => fs.statSync(outfile));
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`✓ ${minify ? 'Minified' : 'Readable'} bundle created: ${sizeKB} KB`);

    if (!minify) {
        const usageExample = `

// Usage example:
/*
// In browser or Node.js:
import { Mnemonic } from './mnemonic.standalone.js';

// Generate from entropy
const entropy = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]);
const mnemonicPhrase = Mnemonic.generateMnemonic(128, 'EN', () => entropy);
console.log('Mnemonic:', mnemonicPhrase);

// Or create a Mnemonic instance
const mnemonicInstance = new Mnemonic();
console.log('Random mnemonic:', mnemonicInstance.phrase);
*/
`;

        const existingContent = readFileSync(outfile, 'utf8');
        writeFileSync(outfile, existingContent + usageExample);
        console.log('Usage examples added to readable bundle');
    }

    return { size: sizeKB, minified: minify };
}

async function buildStandalone() {
    try {
        const readable = await buildBundle(false);
        const minified = await buildBundle(true);

        console.log('\nBuild complete!');
        console.log(`Readable: public/mnemonic.standalone.js (${readable.size} KB)`);
        console.log(`Minified: public/mnemonic.standalone.min.js (${minified.size} KB)`);
        console.log(`Savings: ${((1 - minified.size / readable.size) * 100).toFixed(1)}% smaller`);

    } catch (error) {
        console.error('Build failed:', error.message);
        process.exit(1);
    }
}

buildStandalone();
