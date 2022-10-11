import Vue from 'vue'
import App from './App.vue'
import "@/mobile/flexible" // 适配
import "@/styles/reset.css" // 初始化样式
import router from "@/router"
// import { newMusicAPI } from '@/api/index'

// async function myFn() {
//   const res = await newMusicAPI();
//   console.log(res);
// }
// myFn();

import { Tabbar, TabbarItem, NavBar, Col, Row, Image as VanImage, Cell, Icon, Search, List } from 'vant';

Vue.use(List)
Vue.use(Search)
Vue.use(Icon)
Vue.use(Cell)
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NavBar);
Vue.use(Col);
Vue.use(Row);
Vue.use(VanImage);



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
