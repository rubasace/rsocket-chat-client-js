<template>
	<emoji-picker @emoji="onInsert" :search="emojiSearch" :emoji-table="emojiTable" class="full-height">

		<button
				type="button"
				slot="emoji-invoker"
				slot-scope="{ events: { click: clickEvent } }"
				@click.stop="clickEvent"
				class="emoji-picker-button"
		>
			&#128512;
		</button>

		<div slot="emoji-picker" slot-scope="{ emojis, insert, display }" class="emoji-picker">
			<div>
				<input class="search-emoji-input" type="text" v-model="emojiSearch">
			</div>
			<div class="emoji-list">
				<div v-for="(emojiGroup, category) in emojis" :key="category">
					<p class="emoji-category">{{ category }}</p>
					<div>
							<span
									v-for="(emoji, emojiName) in emojiGroup"
									:key="emojiName"
									@click="insert(emoji)"
									class="emoji"
									:title="emojiName"
							>{{ emoji }}</span>
					</div>
				</div>
			</div>
		</div>

	</emoji-picker>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import EmojiPicker from 'vue-emoji-picker'
	import emojiTable from '@/components/emojis';

	@Component({
		components: {EmojiPicker}
	})
	export default class MessageTextarea extends Vue {

		private emojiSearch: string = '';

		private emojiTable: any = emojiTable;

		private onInsert(emoji: string): void {
			this.$emit('insert', emoji);
		}

	}
</script>

<style scoped>

	.emoji-picker-button {
		border: 0;
		background: none;
		width: 100%;
		height: 100%;
		padding: 0;
		font-size: 3em;
	}

	.emoji-picker {
		position: absolute;
		bottom: 80px;
		left: 10px;
		width: 390px;
		height: 300px;
		background: white;
		border: 1px solid #ccc;
		border-radius: 10px;
		padding: 10px;
	}

	.search-emoji-input {
		width: 100%;
		height: 30px;
		margin-bottom: 10px;
	}

	.emoji-list {
		overflow-y: auto;
		height: calc(100% - 40px);
	}

	.emoji-category {
		margin: 15px 0 5px 0;
	}

	.emoji {
		display: inline-block;
		padding: 5px;
		text-align: center;
		cursor: pointer;
		font-size: 1.3em;
	}
</style>
