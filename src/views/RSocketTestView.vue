<template>
	<div class="rsocket-test-view">
		<img alt="Vue logo" src="../assets/logo.png">

		<h1>Last ID: {{ lastId }}</h1>
		<p>Stored on {{ lastIdDate }}</p>
		<p>
			<label for="id-field">ID:</label>
			&nbsp;
			<input type="text" id="id-field" v-model="inputText">
		</p>
		<p>
			<button @click="onSendButtonClick" :disabled="sender == null">Send</button>
		</p>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import RSocketChannel, {Sender} from '@/RSocketChannel';
	import ConfigurationData from '@/ConfigurationData';

	@Component({})
	export default class RSocketTestView extends Vue {

		private inputText: string = '';

		private sender: Sender<ConfigurationData> | null = null;

		private configuration: ConfigurationData | null = null;

		private get lastId(): string {
			return this.configuration != null ? this.configuration.id : '---';
		}

		private get lastIdDate(): number | null {
			return this.configuration != null ? this.configuration.timestamp : null;
		}

		private onSendButtonClick() {
			if (this.sender) {
				this.sender({
					id: this.inputText,
					timestamp: Date.now()
				});
			} else {
				console.warn('Not ready for send');
			}
		}

		private mounted() {
			new RSocketChannel<ConfigurationData>(
				sender => this.sender = sender,
				configurationData => this.configuration = configurationData
			);
		}

	}
</script>
