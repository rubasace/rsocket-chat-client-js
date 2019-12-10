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
					:class="{error: doValidation && !isValid}"
					@keypress.enter="onLogin"
			>
		</p>

		<p>
			<button @click="onLogin">Login</button>
		</p>

	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';

	@Component({})
	export default class LoginView extends Vue {

		private minLength: number = 3;
		private doValidation: boolean = false;

		private username: string = '';

		private get trimmedUsername(): string {
			return this.username.trim();
		}

		private get isValid(): boolean {
			return this.trimmedUsername.length >= this.minLength;
		}

		private onLogin(): void {
			if (this.isValid) {
				this.$emit('login', this.trimmedUsername);
			} else {
				this.doValidation = true;
			}
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

	.login-view input.error {
		color: red;
		border-color: red;
	}

	.login-view button {
		width: 100px;
	}
</style>
