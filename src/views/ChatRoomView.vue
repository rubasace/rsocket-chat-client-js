<template>
	<div class="chat-room">
		<MessagesContainer :username="username" :messages="messages"></MessagesContainer>
		<MessageTextarea @send="onMessageSent"></MessageTextarea>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import MessagesContainer from '@/components/MessagesContainer.vue';
	import MessageTextarea from '@/components/MessageTextarea.vue';
	import ChatMessage from '@/assets/model/ChatMessage';

	@Component({
		components: {MessageTextarea, MessagesContainer}
	})
	export default class ChatRoomView extends Vue {

		private username: string = 'Néstor';
		private messages: ChatMessage[] = [];

		private onMessageSent(message: ChatMessage): void {
			this.messages.push(message);
		}

		private mounted(): void {
			setTimeout(() => {
				this.messages.push(this.createFakeMessage('Rubén', 'Hey!'));
				setTimeout(() => {
					this.messages.push(this.createFakeMessage('Rubén', 'Qué tal, chavales?'));
					setTimeout(() => {
						this.messages.push(this.createFakeMessage('Regue', 'Hola, hijos de puta! \ud83d\ude1b'));
					}, 7000);
				}, 2000);
			}, 5000);
		}

		private createFakeMessage(user: string, message: string): ChatMessage {
			return {
				id: -1,
				user,
				message,
				timestamp: Date.now()
			};
		}

	}
</script>

<style scoped>

	.chat-room {
		width: 100%;
		height: 100%;
		padding: 10px;
	}

	.chat-room > :nth-child(1) {
		height: calc(100% - 90px);
		margin-bottom: 10px;
	}

	.chat-room > :nth-child(2) {
		height: 80px;
	}

</style>
