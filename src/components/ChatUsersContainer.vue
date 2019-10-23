<template>
	<div class="chat-users-container scroll-border-radius-wrapper full-height">
		<section class="chat-users-container-inner full-height">
			<p class="section-title">
				Room users
			</p>

			<ChatUsersList :users="users"></ChatUsersList>
		</section>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import ChatUsersList from '@/components/ChatUsersList.vue';

	@Component({
		components: {ChatUsersList}
	})
	export default class ChatUsersContainer extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private users!: string[];

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
