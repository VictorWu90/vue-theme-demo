import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import App from './App.vue';

import './assets/styles/reset.scss';
import './assets/styles/theme/theme-dark.scss';
import './assets/styles/theme/theme-light.scss';

// 初始化Vue工具参数
Vue.config.productionTip = false;
Vue.config.silent = false;
Vue.config.performance = true;

Vue.use(Router);

// function ready(fn) {
//     if (document.readyState !== 'loading') {
//         fn();
//     } else {
//         document.addEventListener('DOMContentLoaded', fn);
//     }
// }

// ready(function() {
//     console.log('111');
//     let themeLinks = document.querySelectorAll('link[title]');
//     themeLinks.forEach(function(link) {
//         link.disabled = true;
//         if (link.getAttribute('title') === 'green') {
//             // 该样式CSS文件生效
//             link.disabled = false;
//         }
//     });
// });
let router = new Router({
    routes: routes
});

// let store = new Vuex.Store({});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
});
