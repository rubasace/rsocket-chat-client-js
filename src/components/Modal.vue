<template>
	<div :class="{showing: showing, 'modal-overlay': true}" @click="closeModal">
		<div class="modal" @click="$event.stopPropagation()">
			<div class="modal-title">
				<span class="close-button" @click="closeModal">&times;</span>
				{{ title }}
			</div>

			<div class="modal-body">
				<slot></slot>
			</div>

			<div class="modal-footer">
				<button @click="closeModal">Close</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';

	@Component({})
	export default class Modal extends Vue {

		@Prop({
			default: false,
			type: Boolean
		})
		private showing!: boolean;

		@Prop({
			required: true,
			type: String
		})
		private title!: string;

		private closeModal(event: MouseEvent): void {
			event.stopPropagation();
			this.$emit('update:showing', false);
		}

	}
</script>

<style scoped>

	.modal-overlay, .modal {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;

		transition-timing-function: ease-in-out;
		transition-duration: 0.1s;
	}

	.modal-overlay {
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1000;

		pointer-events: none;

		opacity: 0;
		transition-property: opacity;
	}

	.modal-overlay.showing {
		pointer-events: auto;
		opacity: 1;
	}

	.modal {
		position: absolute;
		width: 60%;
		height: 60%;
		margin: auto;

		background: white;
		border-radius: 4px;
		overflow: hidden;

		transition-property: width, height;
	}

	.modal-overlay.showing > .modal {
		width: 80%;
		height: 80%;
	}

	.modal.hidden {
	}

	.modal-title, .modal-body, .modal-footer {
		position: absolute;
		left: 0;
		right: 0;
		padding: 15px;
	}

	.modal-title {
		top: 0;
		height: 55px;
		font-weight: bold;
		font-size: 1.2em;
	}

	.modal-body {
		position: absolute;
		top: 55px;
		bottom: 65px;
		overflow: auto;
		border-width: 1px 0;
		border-style: solid;
		border-color: #ccc;
	}

	.modal-footer {
		bottom: 0;
		height: 65px;
	}

	.modal-footer > button {
		width: 100%;
	}

	.close-button {
		float: right;
		width: 30px;
		text-align: center;
		/*font-size: 25px;*/
	}
</style>
