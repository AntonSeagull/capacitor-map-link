export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'capacitorCapMapLink',
      globals: {
        '@capacitor/core': 'capacitorExports',
        '@capacitor/action-sheet': 'capacitorActionSheet',
        '@capacitor/app-launcher': 'capacitorLinking',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: [
    '@capacitor/core',
    '@capacitor/action-sheet',
    '@capacitor/app-launcher',
  ],
  onwarn: (warning, warn) => {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    warn(warning);
  },
};
