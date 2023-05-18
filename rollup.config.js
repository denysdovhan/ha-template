/*  eslint-env node */
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import minifyLiterals from 'rollup-plugin-minify-html-literals';

const IS_DEV = process.env.ROLLUP_WATCH;

export default {
  input: 'index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  external: [...Object.keys(pkg.peerDependencies), 'lit/decorators.js'],
  plugins: [
    typescript(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    !IS_DEV && minifyLiterals(),
    !IS_DEV &&
      terser({
        output: {
          comments: false,
        },
      }),
  ],
};
