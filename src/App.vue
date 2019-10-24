<template>
    <div id="app">

        <Loading
                :active="connecting"
                is-full-page
                :width="128"
                :height="128"
                color="#33a070"
        ></Loading>

        <LoginView
                v-if="username == null"
                @login="onLogin"
        ></LoginView>

        <ChatRoomView
                v-else-if="!connecting"
                :username="username"
                :messages="messages"
                :users="users"
                @send="onSendMessage"
        ></ChatRoomView>

        <!--		<RSocketTestView></RSocketTestView>-->
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ChatRoomView from '@/views/ChatRoomView.vue';
    import RSocketTestView from '@/views/RSocketTestView.vue';
    import LoginView from '@/views/LoginView.vue';
    import {connectChatRSocket, MessageSender} from '@/ChatRSocket';
    import UserList from '@/model/UserList';
    import ChatMessage from '@/model/ChatMessage';
    // Import component
    // @ts-ignore
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';

    @Component({
        components: {LoginView, RSocketTestView, ChatRoomView, Loading}
    })
    export default class App extends Vue {

        private username: string | null = null;
        private messages: ChatMessage[] = [];
        private users: string[] = [];

        private sender: MessageSender | null = null;

        private get connecting(): boolean {
            return this.username != null && this.sender == null;
        }

        private onLogin(username: string): void {

            this.username = username;

            const eventBus = connectChatRSocket(username);
            eventBus.on('ready', (sender: MessageSender) => this.sender = sender);
            eventBus.on('user-list', (userList: UserList) => this.users = userList.connections.map(user => user.username));
            eventBus.on('message', (message: ChatMessage) => this.messages.push(message));

        }

        private onSendMessage(message: string): void {
            console.log('Message to be sent:', message);
            this.sender && this.sender(message);
        }

    }
</script>
