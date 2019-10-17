<template>
	<div class="chat-room">
		<MessagesContainer :messages="messages"></MessagesContainer>
		<MessageTextarea @send="onMessageSent"></MessageTextarea>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import MessagesContainer from '@/components/MessagesContainer.vue';
	import MessageTextarea from '@/components/MessageTextarea.vue';

	@Component({
		components: {MessageTextarea, MessagesContainer}
	})
	export default class ChatRoomView extends Vue {

		private messages: string[] = [];

		private onMessageSent(message: string): void {
			this.messages.push(message);
		}

	}
</script>

<style scoped>

	.chat-room {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.chat-room > :nth-child(1) {
		/*height: calc(100% - 180px);*/
		flex-grow: 1;
	}

	.chat-room > :nth-child(2) {
		/*height: 180px;*/
		flex-shrink: 1;
	}

</style>
