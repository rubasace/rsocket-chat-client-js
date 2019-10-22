import Vue from 'vue';
import App from '@/App.vue';

import '@/assets/styles.css';
import fixVhUnits from '@/util/vh-mobile-fix';

Vue.config.productionTip = false;

fixVhUnits();

// window.onerror = function (event) {
// 	alert('Error caught: ' + event);
// };
//
// setTimeout(() => {
// 	// @ts-ignore
// 	window.asdasdasd.pepe();
// }, 1000);

new Vue({
	render: h => h(App),
}).$mount('#app');
