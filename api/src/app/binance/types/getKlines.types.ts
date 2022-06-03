import {SpotOrder} from 'binance';

export interface ExtendedSpotOrder extends SpotOrder {
    wsMarket: string,
    eventType: string,
    eventTime: number,
}
