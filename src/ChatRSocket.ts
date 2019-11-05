import {IdentitySerializers, JsonSerializers, RSocketClient} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import {Flowable} from 'rsocket-flowable';
import {ISubscriber, ISubscription, Payload, ReactiveSocket} from 'rsocket-types';
import Message from '@/model/Message';
import EventBus from '@/util/event-bus/EventBus';
import UserData from '@/model/UserData';
import ConnectionData from '@/model/ConnectionData';
import {getCurrentDeviceType} from '@/util/device-type-detection';

export type MessageSender = (message: string) => void;

const INITIAL_MESSAGES = [
	'Wow, this demo is awesome!! \ud83d\ude31',
	'This looks great! \ud83d\udc4d',
	'RSocket is the best \ud83d\ude0e'
];

function getRandomInitialMessage(): string {
	const randomIndex = Math.floor(Math.random() * INITIAL_MESSAGES.length);
	return INITIAL_MESSAGES[randomIndex];
}

class ChatRSocket {

	private eventBus: EventBus;
	private userId: string | undefined;

	private readyForSending: boolean = false;

	constructor(username: string, eventBus: EventBus) {

		this.eventBus = eventBus;

		const connectionData: ConnectionData = {
			username: username,
			deviceType: getCurrentDeviceType()
		};

		const client = new RSocketClient<any, string>({
			// send/receive objects instead of strings/buffers
			serializers: {
				data: JsonSerializers.data,
				metadata: IdentitySerializers.metadata
			},
			setup: {
				// @ts-ignore
				data: JSON.stringify(connectionData),
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
				// @ts-ignore
				url: window._env_.SERVER_URL
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

	outgoingFlowableSource(subscriber: ISubscriber<Payload<Message, string>>): void {

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

						const data: Message = {
							user: this.userId as string,
							message: message,
							timestamp: Date.now()
						};

						return subscriber.onNext({data});

					};

					setTimeout(() => {
						messageSender(getRandomInitialMessage());
						this.eventBus.trigger('ready', messageSender);
					}, 1000);

				} else {
					console.log('[Outgoing] Connection already established; so request is ignored');
				}

			}
		});


	}

	onConnect(socket: ReactiveSocket<any, string>) {

		const outgoingFlowable = new Flowable<Payload<Message, any>>(subscriber => this.outgoingFlowableSource(subscriber));
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
