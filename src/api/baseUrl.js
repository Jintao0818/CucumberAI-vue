let baseUrl = '';
switch (process.env.NODE_ENV) {
  case 'development':
    baseUrl = 'http://192.168.31.144:3333/'; //开发环境(npm run serve)
    break;
  case 'production':
    baseUrl = 'http://47.100.80.240:9568/'; //生产环境(npm run build)
    break;
}

export default baseUrl;
