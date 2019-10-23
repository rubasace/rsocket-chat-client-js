import Vue from 'vue';
import App from '@/App.vue';
import fixVhUnits from '@/util/vh-mobile-fix';

import '@/assets/styles.css';

Vue.config.productionTip = false;

fixVhUnits();

// window.onerror = function (event) {
// 	alert('Uncaught error: ' + event);
// };

new Vue({
	render: h => h(App),
}).$mount('#app');
