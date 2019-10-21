<template>
	<div class="login-view">

		<p>
			Choose a nickname:
		</p>

		<p>
			<input
					v-model="username"
					:placeholder="`write ${minLength} chars at least`"
					type="text"
					autofocus
					@keypress.enter="onLogin"
			>
		</p>

		<p>
			<button
					:disabled="username.length < minLength"
					@click="onLogin"
			>
				Login
			</button>
		</p>

	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';

	@Component({})
	export default class LoginView extends Vue {

		private minLength: number = 3;

		private username: string = '';

		private onLogin(): void {
			this.$emit('login', this.username);
		}

	}
</script>

<style scoped>
	.login-view {
		width: 280px;
		height: 170px;
		text-align: center;
		background: #f8f8f8;
		margin: calc(40vh - 85px) auto 0;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.login-view > p {
		margin: 20px;
	}

	.login-view input {
		width: 100%;
		text-align: center;
	}

	.login-view button {
		width: 100px;
	}
</style>
