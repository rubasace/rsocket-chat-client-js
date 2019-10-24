<template>
	<div class="chat-users-container scroll-border-radius-wrapper full-height">
		<section class="chat-users-container-inner full-height">
			<p class="section-title">{{ onlineUsersCountMessage }}</p>

			<ChatUsersList :connections="connections"></ChatUsersList>
		</section>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import ChatUsersList from '@/components/ChatUsersList.vue';
	import ConnectionData from '@/model/ConnectionData';

	@Component({
		components: {ChatUsersList}
	})
	export default class ChatUsersContainer extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private connections!: ConnectionData[];

		private get onlineUsersCountMessage(): string {
			if (this.connections.length === 1) {
				return '1 online user';
			}
			return `${this.connections.length} online users`;
		}

	}
</script>

<style scoped>
	.chat-users-container-inner {
		overflow: auto;
		border: 1px solid #ccc;
		border-radius: 10px;
		padding: 10px;
	}

	.section-title {
		margin: 0 0 10px;
		font-weight: bold;
	}
</style>
