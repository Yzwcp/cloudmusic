import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";
import './plugins/Vant'
import  'assets/css/normalize.css'
import  'assets/css/base.css'

import {dateFormat} from "@/common/utils";

Vue.config.productionTip = false

 Vue.prototype.$bus =new Vue()

Vue.filter('format',function (value){
    return dateFormat(value,'yyyy年MM月d日')
})


new Vue({
    router,
    store,
  render: h => h(App)
}).$mount('#app')
