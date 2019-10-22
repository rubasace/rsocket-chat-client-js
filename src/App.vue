<template>
	<div id="app">

		<LoginView
				v-if="username == null"
				@login="onLogin"
		></LoginView>

		<p
				v-else-if="connecting"
		>Connecting...</p>

		<ChatRoomView
				v-else
				:username="username"
				:messages="messages"
				:users="users"
				@send="onSendMessage"
		></ChatRoomView>

		<!--		<RSocketTestView></RSocketTestView>-->
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import ChatRoomView from '@/views/ChatRoomView.vue';
	import RSocketTestView from '@/views/RSocketTestView.vue';
	import LoginView from '@/views/LoginView.vue';
	import {connectChatRSocket, MessageSender} from '@/ChatRSocket';
	import UserList from '@/model/UserList';
	import ChatMessage from '@/model/ChatMessage';

	@Component({
		components: {LoginView, RSocketTestView, ChatRoomView}
	})
	export default class App extends Vue {

		private username: string | null = null;
		private messages: ChatMessage[] = [];
		private users: string[] = [];

		private sender: MessageSender | null = null;

		private get connecting(): boolean {
			return this.username != null && this.sender == null;
		}

		private onLogin(username: string): void {

			this.username = username;

			const eventBus = connectChatRSocket(username);
			eventBus.on('ready', (sender: MessageSender) => this.sender = sender);
			eventBus.on('user-list', (userList: UserList) => this.users = userList.usernames);
			eventBus.on('message', (message: ChatMessage) => this.messages.push(message));

		}

		private onSendMessage(message: string): void {
			console.log('Message to be sent:', message);
			this.sender && this.sender(message);
		}

	}
</script>
