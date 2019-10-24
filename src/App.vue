<template>
	<div id="app">

		<Loading
				:active="connecting"
				is-full-page
				:width="128"
				:height="128"
				color="#33a070"
		></Loading>

		<LoginView
				v-if="username == null"
				@login="onLogin"
		></LoginView>

		<ChatRoomView
				v-else-if="!connecting"
				:username="username"
				:messages="messages"
				:connections="connections"
				@send="onSendMessage"
		></ChatRoomView>

		<audio ref="newMessageSound">
			<source src="../public/notification.mp3" type="audio/mp3">
		</audio>

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
	import ConnectionData from '@/model/ConnectionData';
	// @ts-ignore
	import Loading from 'vue-loading-overlay';

	import 'vue-loading-overlay/dist/vue-loading.css';

	@Component({
		components: {LoginView, RSocketTestView, ChatRoomView, Loading}
	})
	export default class App extends Vue {

		public $refs!: {
			newMessageSound: HTMLAudioElement
		};

		private username: string | null = null;
		private messages: ChatMessage[] = [];
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

			eventBus.on('message', (message: ChatMessage) => {

				this.messages.push(message);

				try {
					if (message.user !== this.username && !document.hasFocus()) {
						this.$refs.newMessageSound.play();
					}
				} catch (error) {
					console.log('Error playing notification:', error);
				}

			});

		}

		private onSendMessage(message: string): void {
			console.log('Message to be sent:', message);
			this.sender && this.sender(message);
		}

	}
</script>
