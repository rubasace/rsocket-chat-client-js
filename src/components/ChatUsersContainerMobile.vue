<template>
	<div class="chat-users-container-mobile full-height">
		<p class="users-count-text" @click="showingModal = true">{{ users.length }} online users</p>

		<Modal title="Room users" :showing.sync="showingModal">
			<ChatUsersList :users="users"></ChatUsersList>
		</Modal>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import ChatUsersList from '@/components/ChatUsersList.vue';
	import Modal from '@/components/Modal.vue';

	@Component({
		components: {Modal, ChatUsersList}
	})
	export default class ChatUsersContainerMobile extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private users!: string[];

		private showingModal: boolean = false;

	}
</script>

<style scoped>
	.chat-users-container-mobile {
		border: 1px solid #ccc;
		border-radius: 10px;
		height: 45px;
		overflow: hidden;
	}

	.users-count-text {
		margin: 0;
		text-align: center;
		font-weight: bold;
		line-height: 43px; /* {container height} - 2 * {container border-width} */
	}
</style>
