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
				>
					{{ user }}
				</li>
			</ul>
		</section>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';

	@Component({})
	export default class ChatUsersContainer extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private users!: string[];

		private get sortedUsers(): string[] {

			const sortedUsers = [...this.users];

			sortedUsers.sort((a, b) => a.localeCompare(b, undefined, {
				sensitivity: 'base'
			}));

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
		color: #33a070;
		word-break: break-word;
	}
</style>
