<template>
	<div class="emoji-list">
		<div class="emoji-category-button-list">
			<button
					v-for="(icon, category) in emojiCategoriesIcons"
					:key="category"
					class="emoji-category-button"
					:class="{selected: category === selectedEmojiCategory}"
					@click="onEmojiCategoryClick(category)"
			>
				{{ icon }}
			</button>
		</div>

		<div
				v-for="(emojiGroup, category) in filteredEmojiTable"
				:key="category"
				v-show="category === selectedEmojiCategory"
				class="emoji-category-emoji-list"
		>
			<span
					v-for="(emoji, emojiName) in emojiGroup"
					:key="emojiName"
					@click.prevent="onEmojiClick(emoji)"
					class="emoji"
					:title="emojiName"
			>{{ emoji }}</span>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import emojiTable, {emojiCategoriesIcons, EmojiCategoriesIcons, EmojiGroup, EmojiTable} from '@/components/emojiTable';
	import vClickOutside from 'v-click-outside';

	@Component({
		directives: {
			clickOutside: vClickOutside.directive
		}
	})
	export default class EmojiSelector extends Vue {

		@Prop({
			type: String,
			default: ''
		})
		private search!: string;

		private emojiTable: EmojiTable = emojiTable;
		private emojiCategoriesIcons: EmojiCategoriesIcons = emojiCategoriesIcons;

		private selectedEmojiCategory: string = this.emojiCategories[0];

		private get emojiCategories(): string[] {
			return Object.keys(this.emojiTable);
		}

		private get lowerCaseSearch(): string {
			return this.search.toLocaleLowerCase();
		}

		private get filteredEmojiTable(): EmojiTable {

			if (this.lowerCaseSearch.length === 0) {
				return this.emojiTable;
			}

			const result: EmojiTable = {};

			Object.keys(this.emojiTable)
				.forEach(emojiGroupName => {

					const emojiGroup: EmojiGroup = this.emojiTable[emojiGroupName];

					const filteredEmojiNames: string[] = Object.keys(emojiGroup)
						.filter(emojiName => emojiName.includes(this.lowerCaseSearch));

					if (filteredEmojiNames.length > 0) {
						const filteredEmojiGroup: EmojiGroup = {};
						filteredEmojiNames.forEach(emojiName => filteredEmojiGroup[emojiName] = emojiGroup[emojiName]);
						result[emojiGroupName] = filteredEmojiGroup;
					}

				});

			return result;

		}

		private onEmojiCategoryClick(category: string) {
			this.selectedEmojiCategory = category;
		}

		private onEmojiClick(emoji: string): void {
			this.$emit('emoji-click', emoji);
		}

	}
</script>

<style scoped>

	.emoji-list {
		overflow: hidden;
		height: calc(100% - 35px);
		background: white;
		border: 1px solid #ccc;
		border-radius: 2px 2px 6px 6px;
	}

	.emoji-category-button-list {
		display: flex;
		flex-direction: row;
		overflow: hidden;
		margin-bottom: 4px;
	}

	.emoji-category-button {
		flex: 1;
		height: 46px;
		font-size: 1.3em;
		margin: 0;
		background: none;
		border: 0;
		border-bottom: 4px solid transparent;
		border-radius: 0;
	}

	.emoji-category-button.selected {
		border-bottom-color: #33a070;
	}

	.emoji-category-emoji-list {
		user-select: none;
		overflow-y: auto;
		height: calc(100% - 50px);
	}

	.emoji {
		display: inline-block;
		padding: 5px;
		text-align: center;
		cursor: pointer;
		font-size: 1.3em;
		width: 35px;
	}

</style>
