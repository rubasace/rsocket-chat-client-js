import DeviceType from '@/model/DeviceType';
<template>
	<ul class="chat-users-list">
		<li
				v-for="(connection, index) in sortedConnections"
				:class="getListItemClass(connection)"
				:key="index"
		>
			{{ connection.username }}
		</li>
	</ul>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import compareStrings from '@/util/compare-strings';
	import ConnectionData from '@/model/ConnectionData';
	import {ClassListObject} from '@/util/vue-types';
	import {isMobileDevice} from '@/util/device-type-detection';


	@Component({})
	export default class ChatUsersList extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private connections!: ConnectionData[];

		private get sortedConnections(): ConnectionData[] {
			const sortedConnections = [...this.connections];
			sortedConnections.sort((a, b) => compareStrings(a.username, b.username));
			return sortedConnections;
		}

		private getListItemClass(connection: ConnectionData): ClassListObject {
			return {
				'chat-user-username': true,
				mobile: isMobileDevice(connection.deviceType)
			};
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
		content: '\d83d\dcbb';
	}

	.chat-user-username.mobile::before {
		content: '\d83d\dcf1';
	}
</style>
