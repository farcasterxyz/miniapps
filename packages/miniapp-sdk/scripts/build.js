const esbuild = require('esbuild')

esbuild.buildSync({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',
  target: 'esnext',
  globalName: 'miniapp',
  outfile: 'dist/index.min.js',
})
