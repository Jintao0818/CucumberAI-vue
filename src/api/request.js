import axios from 'axios';
import baseUrl from './baseUrl';
const httpv = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 3600,
});
export default httpv;
