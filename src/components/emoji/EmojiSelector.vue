<template>
	<div class="full-height">

		<button
				type="button"
				class="emoji-picker-button full-height"
				@click.stop="open = !open"
		>
			&#128512;
		</button>

		<div class="emoji-picker" v-show="open" v-click-outside="onClickOutside">
			<div>
				<input ref="searchInput" class="search-emoji-input" type="text" v-model="emojiSearch">
			</div>
			<EmojiList :search="emojiSearch" @emoji-click="onEmojiClick"></EmojiList>
		</div>

	</div>
</template>

<script lang="ts">
	import {Component, Vue, Watch} from 'vue-property-decorator';
	import vClickOutside from 'v-click-outside';
	import EmojiList from '@/components/emoji/EmojiList.vue';
	import isMobileBrowser from '@/util/mobile-check';

	@Component({
		components: {EmojiList},
		directives: {
			clickOutside: vClickOutside.directive
		}
	})
	export default class EmojiSelector extends Vue {

		public $refs!: {
			searchInput: HTMLInputElement
		};

		private open: boolean = false;
		private emojiSearch: string = '';

		private onEmojiClick(emoji: string): void {
			this.$emit('emoji-click', emoji);
		}

		private onClickOutside(): void {
			this.open = false;
		}

		@Watch('open')
		private onOpenChange(open: boolean): void {
			if (open) {
				this.$emit('open');

				if (!isMobileBrowser()) {
					setTimeout(() => this.$refs.searchInput.focus(), 10);
				}
			} else {
				this.$emit('close');
			}
		}

	}
</script>

<style scoped>

	.emoji-picker-button {
		border: 0;
		background: none;
		width: 100%;
		padding: 0;
		font-size: 2em;
		border-radius: 50%;
	}

	.emoji-picker-button:hover {
		background: #eee;
	}

	.emoji-picker-button:active {
		background: #e5e5e5;
	}

	.emoji-picker {
		position: absolute;
		bottom: 100px;
		left: 10px;
		width: calc(100% - 20px);
		height: calc(var(--vh) * 100 - 110px);
		max-height: 300px;
		background: #f4f4f4;
		border: 1px solid #ccc;
		border-radius: 10px;
		padding: 5px;
		overflow: hidden;
	}

	.search-emoji-input {
		width: 100%;
		height: 30px;
		margin-bottom: 5px;
		border-radius: 6px 6px 2px 2px;
	}

</style>
