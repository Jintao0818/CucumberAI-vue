// npm原有的模块
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  // 入口文件
  entry: './src/main.js',
  // 导出的部分
  output: {
    // 导出的文件名
    filename: 'bundle.js',
    // 导出的文件名会放置的路径
    path: path.resolve(__dirname, 'dist/'),
  },

  module: {
    rules: [
      // 解析Vue文件
      { test: /.vue$/, loader: 'vue-loader' },
      // 它会应用到普通的 .js 文件
      // 以及 .vue 文件中的 <script> 块
      { test: /.js$/, loader: 'babel-loader' },
      // 它会应用到普通的 .css 文件
      // 以及 .vue 文件中的 <style> 块
      { test: /.css$/, use: ['vue-style-loader', 'css-loader'] },
      // compiles Less to CSS
      { test: /\.less$/i, use: ['style-loader', 'css-loader', 'less-loader'] },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
