<template>
	<div class="chat-room full-height">

		<div class="users-and-messages-container">

			<ChatUsersContainer
					:users="chatUsers"
			></ChatUsersContainer>

			<MessagesContainer
					:username="username"
					:messages="messages"
			></MessagesContainer>

		</div>

		<MessageTextarea
				@send="onMessageSent"
		></MessageTextarea>

	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import MessagesContainer from '@/components/MessagesContainer.vue';
	import MessageTextarea from '@/components/MessageTextarea.vue';
	import ChatMessage from '@/assets/model/ChatMessage';
	import ChatUsersContainer from '@/components/ChatUsersContainer.vue';
	import {ChatUser} from '@/assets/model/ChatUser';

	@Component({
		components: {ChatUsersContainer, MessageTextarea, MessagesContainer}
	})
	export default class ChatRoomView extends Vue {

		@Prop({
			type: String,
			required: true
		})
		private username!: string;

		private chatUsers: ChatUser[] = [
			{username: 'Steve', online: false},
			{username: 'Linus', online: true},
			{username: 'Bill', online: true}
		];

		private messages: ChatMessage[] = [];

		private onMessageSent(message: string): void {
			this.messages.push(this.createMessageInstance(message));
		}

		private createMessageInstance(message: string): ChatMessage {
			return {
				id: -1,
				message,
				user: this.username,
				timestamp: Date.now()
			};
		}

		private mounted(): void {
			this.doConnect('Rubén', 3)
				.then(() => this.doMessage('Rubén', 'Hey!', 1))
				.then(() => this.doMessage('Rubén', 'Qué tal, chavales?', 2))
				.then(() => this.doConnect('Regue', 3))
				.then(() => this.doMessage('Regue', 'Hola, hijos de puta! \ud83d\ude1b', 2))
				.then(() => this.doDisconnect('Regue', 2))
				.then(() => this.doDisconnect('Linus', 1))
				.then(() => this.doDisconnect('Rubén', 2))
				.then(() => this.doConnect('Linus', 1))
				.then(() => this.doConnect('Rubén', 1))
				.then(() => this.doConnect('Regue', 1))
				.then(() => this.doMessage('Bill', 'Open the windows', 2));
		}

		private doMessage(user: string, message: string, seconds: number = 0): Promise<any> {
			return this.waitSeconds(seconds).then(() => this.messages.push(this.createFakeMessage(user, message)));
		}

		private createFakeMessage(user: string, message: string): ChatMessage {
			return {
				id: -1,
				user,
				message,
				timestamp: Date.now()
			};
		}

		private doConnect(username: string, seconds: number = 0): Promise<any> {
			return this.waitSeconds(seconds).then(() => this.connectUser(username));
		}

		private connectUser(username: string): void {

			const found = this.findUser(username);

			if (found) {
				found.online = true;
			} else {
				this.chatUsers.push(this.createNewUser(username));
			}
		}

		private createNewUser(username: string): ChatUser {
			return {
				username,
				online: true
			};
		}

		private doDisconnect(username: string, seconds: number = 0): Promise<void> {
			return this.waitSeconds(seconds).then(() => this.disconnectUser(username));
		}

		private disconnectUser(username: string): void {

			const found = this.findUser(username);

			if (found) {
				found.online = false;
			}

		}

		private findUser(username: string): ChatUser | undefined {
			return this.chatUsers.find(u => u.username === username);
		}

		private waitSeconds(seconds: number): Promise<void> {
			if (seconds > 0) {
				return new Promise(resolve => setTimeout(resolve, seconds * 1000));
			} else {
				return Promise.resolve();
			}
		}

	}
</script>

<style scoped>

	.chat-room {
		width: 100%;
		padding: 10px;
	}

	.users-and-messages-container {
		height: calc(100% - 90px);
		margin-bottom: 10px;
	}

	.chat-users-container {
		float: left;
		width: 20%;
		min-width: 80px;
		max-width: 200px;
		margin-right: 10px;
	}

	.message-textarea {
		height: 80px;
	}

</style>
