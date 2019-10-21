declare module 'v-click-outside' {
	import {DirectiveFunction, DirectiveOptions, PluginFunction} from 'vue';
	const vClickOutside: {
		install: PluginFunction<any>;
		directive: DirectiveFunction | DirectiveOptions;
	};
	export default vClickOutside;
}
