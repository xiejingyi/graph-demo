import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy'
import { babel } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
    globals: {
      d3: 'd3',
      'd3-path': 'd3-path'
    }
  },
  plugins: [
    terser(), // 压缩输出文件（可选）
    copy({
      targets: [
        {src: 'src/index.html', dest: 'dist'},
        {src: 'src/main.html', dest: 'dist'}
      ]
    }),
    serve({
      open: false,
      contentBase: 'dist',
    }),
    livereload('dist'),
    babel({
      babelHelpers: 'bundled'
    }),
    resolve({
      // 将自定义选项传递给解析插件
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs()
  ]
};
