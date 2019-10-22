<template>
	<div class="messages-container scroll-border-radius-wrapper full-height">
		<div ref="container" class="messages-container-inner full-height">
			<div
					v-for="(message, index) in messages"
					:key="index"
					:class="{message: true, 'own-message': message.user === username}"
			>
				<p class="message-timestamp">{{ message.timestamp | formatTimestamp }}</p>
				<p class="message-user">{{ message.user }} said:</p>
				<p class="message-content">{{ message.message }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
	import ChatMessage from '@/model/ChatMessage';

	@Component({
		filters: {
			formatTimestamp(timestamp: number) {
				const date = new Date(timestamp);
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				return `${hours}:${minutes}`;
			}
		}
	})
	export default class MessagesContainer extends Vue {

		public $refs!: {
			container: HTMLDivElement
		};

		@Prop({
			required: true,
			type: String
		})
		private username!: string;

		@Prop({
			required: true,
			type: Array
		})
		private messages!: ChatMessage[];

		@Watch('messages')
		private onMessagesChange(): void {
			setTimeout(this.moveScrollToBottom, 10);
		}

		private mounted(): void {
			this.moveScrollToBottom();
		}

		private moveScrollToBottom(): void {
			this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
		}

	}
</script>

<style scoped>
	.scroll-border-radius-wrapper {
		border-radius: 10px;
		overflow: hidden;
	}

	.messages-container-inner {
		overflow: auto;
		border: 1px solid #ccc;
		border-radius: 10px;
	}

	.message {
		position: relative;
		background-color: #ebedff;
		margin: 10px;
		max-width: 90%;
		border: 1px solid #cad0ff;
		border-radius: 10px;
		padding: 10px;
	}

	.message.own-message {
		margin-left: 10%;
		background-color: #ebffed;
		border-color: #bff5c4;
	}

	.message-timestamp {
		float: right;
		margin: 0;
		font-size: 0.8em;
		color: gray;
	}

	.message-user {
		margin: 0;
		font-size: 0.8em;
		color: gray;
	}

	.message-content {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>
