<template>
	<div id="app">

		<LoginView
				v-if="username == null"
				@login="username = $event"
		></LoginView>

		<ChatRoomView
				v-else
				:username="username"
		></ChatRoomView>

		<!--		<RSocketTestView></RSocketTestView>-->
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import ChatRoomView from '@/views/ChatRoomView.vue';
	import RSocketTestView from '@/views/RSocketTestView.vue';
	import LoginView from '@/views/LoginView.vue';

	@Component({
		components: {LoginView, RSocketTestView, ChatRoomView}
	})
	export default class App extends Vue {

		private username: string | null = null;

	}
</script>
