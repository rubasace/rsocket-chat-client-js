<template>
	<div id="app">

		<LoginView
				v-if="username == null"
				@login="onLogin"
		/>

		<ChatRoomView
				v-else-if="!connecting"
				:username="username"
				:messages="messages"
				:connections="connections"
				@send="onSendMessage"
		/>

		<Loading
				:active="connecting"
				is-full-page
				:width="128"
				:height="128"
				color="#33a070"
		/>

	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import ChatRoomView from '@/views/ChatRoomView.vue';
	import LoginView from '@/views/LoginView.vue';
	import {connectChatRSocket, MessageSender} from '@/ChatRSocket';
	import UserList from '@/model/UserList';
	import Message from '@/model/Message';
	import ConnectionData from '@/model/ConnectionData';
	// @ts-ignore
	import Loading from 'vue-loading-overlay';

	import 'vue-loading-overlay/dist/vue-loading.css';

	@Component({
		components: {LoginView, ChatRoomView, Loading}
	})
	export default class App extends Vue {

		private username: string | null = null;
		private messages: Message[] = [];
		private connections: ConnectionData[] = [];

		private sender: MessageSender | null = null;

		private get connecting(): boolean {
			return this.username != null && this.sender == null;
		}

		private onLogin(username: string): void {

			this.username = username;

			const eventBus = connectChatRSocket(username);

			eventBus.on('ready', (sender: MessageSender) => this.sender = sender);
			eventBus.on('user-list', (userList: UserList) => this.connections = userList.connections);
			eventBus.on('message', (message: Message) => this.messages.push(message));

		}

		private onSendMessage(message: string): void {
			console.log('Message to be sent:', message);
			this.sender!(message);
		}

	}
</script>
