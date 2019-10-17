<template>
	<div id="app">
		<!--		<ChatRoomView></ChatRoomView>-->
		<RSocketTestView></RSocketTestView>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import ChatRoomView from '@/views/ChatRoomView.vue';
	import RSocketTestView from '@/views/RSocketTestView.vue';

	@Component({
		components: {RSocketTestView, ChatRoomView}
	})
	export default class App extends Vue {

	}
</script>
