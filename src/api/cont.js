import request from './request';

export default {
  upload(params) {
    return request.post('/upload', params);
  },
  predict(params) {
    return request.post('/predict', params);
  },
  clear(params) {
    return request.post('/clear', params);
  },
  checkStatus() {
    return request.get('/status');
  },
};
