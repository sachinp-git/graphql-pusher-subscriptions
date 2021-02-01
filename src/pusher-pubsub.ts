import { PubSubAsyncIterator } from './pubsub-async-iterator'
import { PubSubEngine } from 'graphql-subscriptions'
import SubPusher from 'pusher-js';
import Pusher from 'pusher';

export class PusherChannel implements PubSubEngine {
  private subPusher: any;
  private pubPusher: any;
  private channel: any;
  private channelName : string;
  private subIdCounter: number;
  private subscriptions: number[];

  constructor(options: Pusher.ClusterOptions & { channel: string}) {
    this.subPusher = new SubPusher(options.key, {
      cluster: options.cluster,
    });
    this.channelName = options.channel;
    this.pubPusher = new Pusher(options);
    this.channel = this.subPusher.subscribe(this.channelName);
    this.subIdCounter = 0;
    this.subscriptions = [];
    this.subPusher.disconnect();
  }

  public async publish(event: string, payload: any): Promise<void> {
    return await this.pubPusher.trigger(this.channelName, event, payload)
  }

  public async subscribe(eventName: string, onMessage: Function): Promise<number> {
    const subscribeStatus = this.pusherSubscribeStatus();
    if(!subscribeStatus) {
      this.subPusher.connect();
    }
    this.subIdCounter = this.subIdCounter + 1;
    this.subscriptions.push(this.subIdCounter);
    await this.channel.bind(eventName, (event: string) => onMessage(event));
    return this.subIdCounter;
  }

  public unsubscribe(subscriptionId: number) {
    this.subscriptions = this.subscriptions.filter(item => item !== subscriptionId);
    if(this.subscriptions.length === 0) {
      this.subPusher.disconnect();
    }
  }

  public pusherSubscribeStatus(): boolean {
    if(this.subPusher.connection.state === 'connected') return true;
    return false;
  }

  public asyncIterator<T>(subjects: string | string[]): AsyncIterator<T> {
    return new PubSubAsyncIterator<T>(this, this.channelName, subjects)
  }
}