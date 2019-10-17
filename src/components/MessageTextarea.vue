<template>
	<div class="message-textarea">
		<div class="textarea-container">
			<textarea
					v-model="message"
					rows="3"
					@keypress.enter="onEnterPress"
			></textarea>
		</div>
		<div class="send-button-container">
			<button @click="sendMessage">Send</button>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';

	@Component({})
	export default class MessageTextarea extends Vue {

		private message: string = '';

		private sendMessage() {
			this.$emit('send', this.message);
			this.message = '';
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
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: stretch;

		width: 100%;
		padding: 10px;
	}

	.message-textarea > * {
		margin-right: 10px;
	}

	.message-textarea > *:last-child {
		margin-right: 0;
	}

	.textarea-container {
		flex-grow: 1;
	}

	.textarea-container textarea {
		width: 100%;
		resize: none;
	}

	.send-button-container {
		flex-shrink: 1;
		align-self: center;
		display: flex;
	}

	.send-button-container button {
		/*height: 50px;*/
	}
</style>
