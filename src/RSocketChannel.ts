import {IdentitySerializers, JsonSerializers, RSocketClient} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import {Flowable, Single} from 'rsocket-flowable';
import {ISubscriber, ISubscription, Payload, ReactiveSocket} from 'rsocket-types';
import Message from "@/Message";

type Consumer<T> = (t: T) => void;
type Sender<T> = (data: T) => void;

export {
    Consumer,
    Sender
};

export default class RSocketChannel<I, O = I> {

    private onReadyCallback: Consumer<Sender<O>>;
    private onReceivedCallback: Consumer<I>;

    private client: RSocketClient<I, string>;
    private connection: Single<ReactiveSocket<I, string>>;

    private readyForSending: boolean = false;

    constructor(onReadyCallback: Consumer<Sender<O>>, onReceivedCallback: Consumer<I>) {

        this.onReadyCallback = onReadyCallback;
        this.onReceivedCallback = onReceivedCallback;


        this.client = new RSocketClient<I, string>({
            // send/receive objects instead of strings/buffers
            serializers: {
                data: JsonSerializers.data,
                metadata: IdentitySerializers.metadata
            },
            setup: {
                // @ts-ignore
                data: '{"userId": "TypescriptBot"}',
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
                url: 'ws://localhost:7000/'
            }),
            responder: {
                fireAndForget(payload: Payload<I, string>): void {
                    console.log('My userId is ' + JSON.stringify(payload.data))

                }
            }
        });

        this.connection = this.client.connect();
        this.connection.then(socket => this.onConnect(socket));

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
                    // TODO read userId properly and reuse it here
                    subscriber.onNext({data: {user: "I dont exist", message: "Wow, this demo is awesome!!", timestamp: new Date().getTime()}});
                    this.readyForSending = true;
                    // this.onReadyCallback(data => subscriber.onNext({data}));
                } else {
                    console.log('[Outgoing] Connection already established; so request is ignored');
                }

            }
        });


    }

    onConnect(socket: ReactiveSocket<I, string>) {

        const outgoingFlowable = new Flowable<Payload<Message, any>>(subscriber => this.outgoingFlowableSource(subscriber));
        const incomingFlowable = socket.requestChannel(outgoingFlowable as any as Flowable<Payload<I, any>>);

        incomingFlowable.subscribe({
            onComplete() {
                console.log('[Messages] Completed');
            },
            onError(error) {
                console.error('[Messages] Error:', error);
            },
            onNext: (value: Payload<I, string>) => {
                console.log('[Messages] Received:', JSON.stringify(value.data));

                if (value.data != null) {
                    try {
                        this.onReceivedCallback(value.data);
                    } catch (error) {
                        console.error('onReceivedCallback() error:', error);
                    }
                }
            },
            // Nothing happens until `request(n)` is called
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
            onNext: (value: Payload<I, string>) => {
                console.log('[Notifications] Received:', JSON.stringify(value.data));
            },
            // Nothing happens until `request(n)` is called
            onSubscribe(sub: ISubscription) {
                console.log('[Notifications] I am subscribed.');
                sub.request(99999);
            }
        })

    }

}
