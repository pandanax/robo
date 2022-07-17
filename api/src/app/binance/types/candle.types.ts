import {KlineInterval} from 'binance/lib/types/shared';
import {Field} from '@nestjs/graphql';

export interface ICandle {
    symbol: string,
    startTime: number,
    endTime: number,
    interval: KlineInterval,
    openTime: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    closeTime: number,
    quoteAssetVolume: number,
    numberOfTrades: number,
    takerBuyBaseAssetVolume: number,
    takerBuyQuoteAssetVolume: number,
}

export interface ISymbolInterval {
    interval: KlineInterval
    symbol: string
}

export interface ICandleRequest {

    symbol: string

    interval: KlineInterval

    dateFrom: string

    dateTo: string
}
