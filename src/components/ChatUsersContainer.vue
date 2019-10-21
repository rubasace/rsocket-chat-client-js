<template>
	<div class="chat-users-container scroll-border-radius-wrapper full-height">
		<section class="chat-users-container-inner full-height">
			<p class="section-title">
				Room users
			</p>

			<ul class="chat-users-list">
				<li
						v-for="(user, index) in sortedUsers"
						:key="index"
						:class="{online: user.online}"
				>
					{{ user.username }}
				</li>
			</ul>
		</section>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ChatUser} from '@/assets/model/ChatUser';

	@Component({})
	export default class ChatUsersContainer extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private users!: ChatUser[];

		private get sortedUsers(): ChatUser[] {

			const sortedUsers = [...this.users];

			sortedUsers.sort((a, b) => {

				const onlineDiff = Number(b.online) - Number(a.online);

				if (onlineDiff !== 0) {
					return onlineDiff;
				}

				return a.username.localeCompare(b.username, undefined, {
					sensitivity: 'base'
				});

			});

			return sortedUsers;

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

	.chat-users-list {
		padding: 0;
		list-style: none;
	}

	.chat-users-list > li {
		margin: 0 0 5px;
		color: #ccc;
		word-break: break-word;
	}

	.chat-users-list > li.online {
		color: #33a070;
	}
</style>
