import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

//ant design vue(桌面)
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

//varlet ui(移动)
import Varlet from '@varlet/ui';
import '@varlet/ui/es/style';

createApp(App).use(Antd).use(Varlet).use(store).use(router).mount('#app');
