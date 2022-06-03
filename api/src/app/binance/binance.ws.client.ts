const { WebsocketClient } = require('binance');

export const binanceWsClient = new WebsocketClient({
    api_key: process.env.BINANCE_API_KEY,
    api_secret: process.env.BINANCE_API_SECRET,
    beautify: true,
    // Disable ping/pong ws heartbeat mechanism (not recommended)
    // disableHeartbeat: true
});
/*

// receive raw events
binanceWsClient.on('message', (data) => {
    console.log('raw message received ', JSON.stringify(data, null, 2));
});

// notification when a connection is opened
binanceWsClient.on('open', (data) => {
    console.log('connection opened open:', data.wsKey, data.ws.target.url);
});

// receive formatted events with beautified keys. Any "known" floats stored in strings as parsed as floats.
binanceWsClient.on('formattedMessage', (data) => {
    console.log('formattedMessage: ', data);
});

// read response to command sent via WS stream (e.g LIST_SUBSCRIPTIONS)
binanceWsClient.on('reply', (data) => {
    console.log('log reply: ', JSON.stringify(data, null, 2));
});

// receive notification when a ws connection is reconnecting automatically
binanceWsClient.on('reconnecting', (data) => {
    console.log('ws automatically reconnecting.... ', data?.wsKey );
});

// receive notification that a reconnection completed successfully (e.g use REST to check for missing data)
binanceWsClient.on('reconnected', (data) => {
    console.log('ws has reconnected ', data?.wsKey );
});
*/
