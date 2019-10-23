<template>
	<ul class="chat-users-list">
		<li class="chat-user-username mobile"
			v-for="(user, index) in sortedUsers"
			:key="index"
		>
			{{ user }}
		</li>
	</ul>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import compareStrings from '@/util/compare-strings';

	@Component({})
	export default class ChatUsersList extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private users!: string[];

		private get sortedUsers(): string[] {
			const sortedUsers = [...this.users];
			sortedUsers.sort(compareStrings);
			return sortedUsers;
		}

	}
</script>

<style scoped>
	.chat-users-list {
		padding-left: 0;
		list-style: none;
	}

	.chat-user-username {
		margin: 0 0 15px;
		color: #33a070;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chat-user-username::before {
		/*content: '\d83d\dc64';*/
		content: '\d83d\dcbb';
	}

	.chat-user-username.mobile::before {
		content: '\d83d\dcf1';
	}
</style>
