import {IdentitySerializers, JsonSerializers, RSocketClient} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import {Flowable} from 'rsocket-flowable';
import {ISubscriber, ISubscription, Payload, ReactiveSocket} from 'rsocket-types';
import ChatMessage from '@/model/ChatMessage';
import EventBus from '@/util/event-bus/EventBus';
import UserData from '@/model/UserData';

export type MessageSender = (message: string) => void;

class ChatRSocket {

	private eventBus: EventBus;
	private userId: string | undefined;

	private readyForSending: boolean = false;

	constructor(username: string, eventBus: EventBus) {

		this.eventBus = eventBus;

		const client = new RSocketClient<any, string>({
			// send/receive objects instead of strings/buffers
			serializers: {
				data: JsonSerializers.data,
				metadata: IdentitySerializers.metadata
			},
			setup: {
				// @ts-ignore
				data: JSON.stringify({
					userId: username
				}),
				// ms btw sending keepalive to server
				keepAlive: 60000,
				// ms timeout if no keepalive response
				lifetime: 180000,
				// format of `data`
				dataMimeType: 'application/json',
				// format of `metadata`
				// metadataMimeType: 'application/json',
				metadataMimeType: 'message/x.rsocket.routing.v0',
			},
			transport: new RSocketWebSocketClient({
				// url: 'ws://81.154.207.110:17000/'
				// url: 'ws://localhost:7000/'
				url: 'ws://192.168.0.14:7000/'
			}),
			responder: {
				fireAndForget: (payload: Payload<UserData, string>): void => {
					console.log('My userId is ' + JSON.stringify(payload.data));
					this.userId = (payload.data as UserData).userId;
				}
			}
		});

		client.connect()
			.then((socket: ReactiveSocket<any, string>) => this.onConnect(socket), (error: any) => alert(error));

	}

	outgoingFlowableSource(subscriber: ISubscriber<Payload<ChatMessage, string>>): void {

		// this is not executed until `subscribe()` is called

		subscriber.onSubscribe({
			cancel: () => {
				console.log('[Outgoing] Cancelled.');
			},
			request: (n: number) => {
				// Can't publish values until request() is called

				console.log(`[Outgoing] Asked for ${n}.`);

				if (!this.readyForSending) {

					console.log('[Outgoing] Sending Greeting...');
					this.readyForSending = true;

					const messageSender: MessageSender = (message: string) => {

						const data: ChatMessage = {
							user: this.userId as string,
							message: message,
							timestamp: Date.now()
						};

						return subscriber.onNext({data});

					};

					setTimeout(() => {
						messageSender('Wow, this demo is awesome!!');
						this.eventBus.trigger('ready', messageSender);
					}, 1000);

				} else {
					console.log('[Outgoing] Connection already established; so request is ignored');
				}

			}
		});


	}

	onConnect(socket: ReactiveSocket<any, string>) {

		const outgoingFlowable = new Flowable<Payload<ChatMessage, any>>(subscriber => this.outgoingFlowableSource(subscriber));
		const incomingFlowable = socket.requestChannel(outgoingFlowable as any as Flowable<Payload<any, any>>);

		incomingFlowable.subscribe({
			onComplete() {
				console.log('[Messages] Completed');
			},
			onError(error) {
				console.error('[Messages] Error:', error);
			},
			onNext: (value: Payload<any, string>) => {
				console.log('[Messages] Received:', JSON.stringify(value.data));

				try {
					this.eventBus.trigger('message', value.data);
				} catch (error) {
					console.error('onReceivedCallback() error:', error);
				}
			},
			onSubscribe(sub: ISubscription) {
				console.log('[Messages] I am subscribed.');
				sub.request(99999);
			},
		});

		socket.requestStream({}).subscribe({
			onComplete() {
				console.log('[Notifications] Completed');
			},
			onError(error) {
				console.error('[Notifications] Error:', error);
			},
			onNext: (value: Payload<any, string>) => {
				console.log('[Notifications] Received:', JSON.stringify(value.data));
				this.eventBus.trigger('user-list', value.data);
			},
			onSubscribe(sub: ISubscription) {
				console.log('[Notifications] I am subscribed.');
				sub.request(99999);
			}
		})

	}

}

export function connectChatRSocket(username: string): EventBus {
	const eventBus = new EventBus();
	new ChatRSocket(username, eventBus);
	return eventBus;
}
