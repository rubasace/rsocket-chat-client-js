<template>
	<div class="rsocket-test-view">
		<img alt="Vue logo" src="../assets/logo.png">

		<h1>Last ID: {{ lastId }}</h1>
		<p>Stored on {{ lastIdDate }}</p>
		<p>
			<label for="id-field">ID:</label>
			&nbsp;
			<input type="text" id="id-field" v-model="inputText">
		</p>
		<p>
			<button @click="onSendButtonClick" :disabled="sender == null">Send</button>
		</p>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import {connectChatRSocket, MessageSender} from '@/ChatRSocket';
	import ChatMessage from '@/model/ChatMessage';
	import UserList from '@/model/UserList';

	@Component({})
	export default class RSocketTestView extends Vue {

		private inputText: string = '';

		private sender: MessageSender | null = null;

		private message: ChatMessage | null = null;

		private get lastId(): string {
			return this.message != null ? this.message.message : '---';
		}

		private get lastIdDate(): number | null {
			return this.message != null ? this.message.timestamp : null;
		}

		private onSendButtonClick() {
			if (this.sender) {
				this.sender(this.inputText);
			} else {
				console.warn('Not ready for send');
			}
		}

		private mounted() {
			const rsocket = connectChatRSocket('TypescriptBot');
			rsocket.on('ready', (sender: MessageSender) => this.sender = sender);
			rsocket.on('user-list', (userList: UserList) => console.log('User list:', JSON.stringify(userList)));
			rsocket.on('message', (message: ChatMessage) => this.message = message);
		}

	}
</script>
