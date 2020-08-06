# graphql-pusher-subscriptions

This package implements the PubSubEngine Interface from the graphql-subscriptions package and also the new AsyncIterator interface. It allows you to connect your subscriptions manger to a Pusher channel and bind to multiple events.

## Usage

After creating an account and configuring a channel on pusher, you get the necessary config information about your application. Keep the config information in a safe place. 

```javascript
import { PusherChannel } from 'graphql-pusher-subscriptions'

const pubsub = new PusherChannel({
  appId: 'YOUR_APP_ID',
  key: 'APP_KEY',
  secret: 'SECRET',
  cluster: 'YOUR_SELECTED_CLUSTER',
  channel: 'CHANNEL_NAME'
});

```
