<template>
	<div class="chat-users-container-mobile full-height">
		<p class="users-count-text" @click="showingModal = true">{{ onlineUsersCountMessage }}</p>

		<Modal :title="onlineUsersCountMessage" :showing.sync="showingModal">
			<ChatUsersList :connections="connections"></ChatUsersList>
		</Modal>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import ChatUsersList from '@/components/ChatUsersList.vue';
	import Modal from '@/components/Modal.vue';
	import ConnectionData from '@/model/ConnectionData';

	@Component({
		components: {Modal, ChatUsersList}
	})
	export default class ChatUsersContainerMobile extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private connections!: ConnectionData[];

		private showingModal: boolean = false;

		private get onlineUsersCountMessage(): string {
			if (this.connections.length === 1) {
				return '1 online user';
			}
			return `${this.connections.length} online users`;
		}

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
