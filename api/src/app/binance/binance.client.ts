import {MainClient} from 'binance';

export const binanceClient = new MainClient({
    api_key: process.env.BINANCE_API_KEY,
    api_secret: process.env.BINANCE_API_SECRET,
});
