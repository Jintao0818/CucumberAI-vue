const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: './',
  // devServer: {
  //   port: 8080,
  //   host: 'localhost',
  //   open: true,
  //   https: false,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3333/',
  //       ws: true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': '',
  //       },
  //     },
  //   },
  // },
});
