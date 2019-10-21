import Vue from 'vue';
import App from '@/App.vue';

import '@/assets/styles.css';
import fixVhUnits from '@/util/vh-mobile-fix';

Vue.config.productionTip = false;

fixVhUnits();

new Vue({
	render: h => h(App),
}).$mount('#app');
