<template>
	<div class="messages-container">
		<p v-for="message in messages" class="message">{{ message }}</p>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';

	@Component({})
	export default class MessagesContainer extends Vue {

		@Prop({
			required: true,
			type: Array
		})
		private messages!: string[];

	}
</script>

<style scoped>
	.messages-container {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-end;
		align-items: stretch;
	}

	.message {
		white-space: pre;
	}
</style>
