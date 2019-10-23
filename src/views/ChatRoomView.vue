<template>
	<div class="chat-room full-height">

		<div class="users-and-messages-container">

			<ChatUsersContainerMobile
					v-if="mobileBrowser"
					:users="users"
			></ChatUsersContainerMobile>

			<ChatUsersContainer
					v-else
					:users="users"
			></ChatUsersContainer>

			<MessagesContainer
					:class="{mobile: mobileBrowser}"
					:username="username"
					:messages="messages"
			></MessagesContainer>

		</div>

		<MessageTextarea
				@send="$emit('send', $event)"
		></MessageTextarea>

	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import MessagesContainer from '@/components/MessagesContainer.vue';
	import MessageTextarea from '@/components/MessageTextarea.vue';
	import ChatMessage from '@/model/ChatMessage';
	import ChatUsersContainer from '@/components/ChatUsersContainer.vue';
	import isMobileBrowser from '@/util/mobile-check';
	import ChatUsersContainerMobile from '@/components/ChatUsersContainerMobile.vue';

	@Component({
		components: {ChatUsersContainerMobile, ChatUsersContainer, MessageTextarea, MessagesContainer}
	})
	export default class ChatRoomView extends Vue {

		@Prop({
			type: String,
			required: true
		})
		private username!: string;

		@Prop({
			type: Array,
			required: true
		})
		private messages!: ChatMessage[];

		@Prop({
			type: Array,
			required: true
		})
		private users!: string[];

		private mobileBrowser: boolean = isMobileBrowser();

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
		min-width: 180px;
		max-width: 220px;
		margin-right: 10px;
	}

	.messages-container.mobile {
		margin-top: 10px;
		height: calc(100% - 55px);
	}

	.message-textarea {
		height: 80px;
	}

</style>
