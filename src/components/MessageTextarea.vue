<template>
	<div class="message-textarea">
		<div class="emoji-button-container">
			<EmojiSelector @insert="insertEmoji"></EmojiSelector>
		</div>
		<div class="textarea-container">
			<textarea
					ref="textarea"
					v-model="message"
					rows="3"
					@keypress.enter="onEnterPress"
			></textarea>
		</div>
		<div class="send-button-container">
			<button :disabled="message.length === 0" @click="sendMessage">Send</button>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import ChatMessage from '@/assets/model/ChatMessage';
	import EmojiPicker from 'vue-emoji-picker'
	import EmojiSelector from '@/components/EmojiSelector.vue';

	@Component({
		components: {EmojiSelector, EmojiPicker}
	})
	export default class MessageTextarea extends Vue {

		public $refs!: {
			textarea: HTMLTextAreaElement
		};

		private message: string = '';

		private sendMessage() {
			if (this.message.length === 0) {
				return;
			}

			this.$emit('send', this.createMessageInstance());
			this.clearCurrentMessage();
			this.$refs.textarea.focus();
		}

		private createMessageInstance(): ChatMessage {
			return {
				id: -1,
				message: this.message,
				user: 'Néstor',
				timestamp: Date.now()
			};
		}

		private clearCurrentMessage(): void {
			this.message = '';
		}

		private insertEmoji(emoji: string): void {

			const {
				selectionStart,
				selectionEnd
			} = this.$refs.textarea;

			if (selectionStart === this.message.length) {
				this.message += emoji;
			} else {
				this.message = this.message.substring(0, selectionStart) + emoji + this.message.substring(selectionEnd);
			}

		}

		private onEnterPress(event: KeyboardEvent) {
			if (event.ctrlKey) {
				this.message += '\n';
			} else if (!event.shiftKey) {
				event.preventDefault();
				this.sendMessage();
			}
		}

	}
</script>

<style scoped>
	.message-textarea {
		width: 100%;
		height: 100%;
	}

	.message-textarea > * {
		margin-right: 10px;
	}

	.message-textarea > :last-child {
		margin-right: 0;
	}

	.emoji-button-container {
		float: left;
		width: 80px;
		height: 100%;
	}

	.textarea-container {
		float: left;
		width: calc(100% - 180px);
		height: 100%;
	}

	.textarea-container textarea {
		width: 100%;
		height: 100%;
		resize: none;
		outline: none;
		font-family: Roboto, sans-serif;
		font-size: 1em;
		font-weight: 300;
	}

	.send-button-container {
		float: left;
		width: 80px;
		height: 100%;
	}

	.send-button-container button {
		width: 100%;
		height: 80px;
	}
</style>
