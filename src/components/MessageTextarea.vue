<template>
	<div class="message-textarea">
		<div class="emoji-button-container full-height">
			<EmojiSelector :showing.sync="showingEmojiSelector" @emoji-click="insertEmoji" @close="onEmojiSelectorClose"></EmojiSelector>
		</div>
		<div class="textarea-container full-height">
			<textarea
					ref="textarea"
					class="full-height"
					v-model="message"
					rows="3"
					@keypress.enter="onEnterPress"
					@blur="onTextAreaBlur"
			></textarea>
		</div>
		<div class="send-button-container full-height">
			<button ref="sendButton" @click="sendMessage">Send</button>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import EmojiPicker from 'vue-emoji-picker'
	import EmojiSelector from '@/components/emoji/EmojiSelector.vue';
	import {isMobileDevice} from '@/util/device-type-detection';

	@Component({
		components: {EmojiSelector, EmojiPicker}
	})
	export default class MessageTextarea extends Vue {

		public $refs!: {
			textarea: HTMLTextAreaElement,
			sendButton: HTMLButtonElement
		};

		private showingEmojiSelector: boolean = false;

		private message: string = '';

		private sendMessage() {
			if (this.message.length === 0) {
				return;
			}

			this.$emit('send', this.message);

			console.log('Showing before:', this.showingEmojiSelector);
			this.showingEmojiSelector = false;
			console.log('Showing after:', this.showingEmojiSelector);
			this.clearCurrentMessage();

			if (!isMobileDevice()) {
				this.$refs.textarea.focus();
			}
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

			const newSelectionIndex = selectionStart + emoji.length;

			setTimeout(() => {
				this.$refs.textarea.setSelectionRange(newSelectionIndex, newSelectionIndex, 'forward');
				if (!isMobileDevice()) {
					this.$refs.textarea.focus();
				}
			}, 10);

		}

		private onEnterPress(event: KeyboardEvent): void {

			if (isMobileDevice()) {
				// Do default behaviour
				return;
			}

			if (event.ctrlKey) {
				this.message += '\n';
			} else if (!event.shiftKey) {
				event.preventDefault();
				this.sendMessage();
			}

		}

		private onTextAreaBlur(event: FocusEvent): void {
			// Prevent textarea's focus lost when clicking/touching the send button
			if (event.relatedTarget === this.$refs.sendButton) {
				this.$refs.textarea.focus();
			}
		}

		private onEmojiSelectorClose(): void {
			if (!isMobileDevice()) {
				this.$refs.textarea.focus();
			}
		}

		private mounted(): void {
			this.$refs.textarea.focus();
		}

	}
</script>

<style scoped>
	.message-textarea {
		width: 100%;
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
		padding: 10px;
	}

	.textarea-container {
		float: left;
		width: calc(100% - 180px);
	}

	.textarea-container textarea {
		width: 100%;
		resize: none;
		outline: none;
		font-family: Roboto, sans-serif;
		font-size: 1em;
		font-weight: 300;
	}

	.send-button-container {
		float: left;
		width: 80px;
	}

	.send-button-container button {
		width: 100%;
		height: 80px;
	}
</style>
