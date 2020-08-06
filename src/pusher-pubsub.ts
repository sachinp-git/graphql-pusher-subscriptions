import { PubSubAsyncIterator } from './pubsub-async-iterator'
import { PubSubEngine } from 'graphql-subscriptions'
import SubPusher, { Channel } from 'pusher-js';
import * as Pusher from 'pusher';

export class PusherChannel implements PubSubEngine {
  private subPusher: any;
  private pubPusher: any;
  private channel: any;
  private channelName : string;

  constructor(options: Pusher.ClusterOptions & { channel: string}) {
    this.subPusher = new SubPusher(options.key, {
      cluster: options.cluster,
    });
    this.channelName = options.channel;
    this.pubPusher = new Pusher(options);
    this.channel = this.subPusher.subscribe(options.channel);
  }

  public async publish(event: string, payload: any): Promise<void> {
    return await this.pubPusher.trigger(this.channelName, event, payload)
  }

  public async subscribe(eventName: string, onMessage: Function): Promise<number> {
    return await this.channel.bind(eventName, (event: string) => onMessage(event))
  }

  public unsubscribe() {
    this.channel.unsubscribe(this.channelName)
  }

  public asyncIterator<T>(subjects: string | string[]): AsyncIterator<T> {
    return new PubSubAsyncIterator<T>(this, this.channelName, subjects)
  }
}
