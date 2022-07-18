import {KlineInterval} from 'binance/lib/types/shared';

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


export interface DatesInput {
    dateFromInt: number,
    dateToInt: number,
    interval: KlineInterval
}

export interface ItemsInput {
    dateFromInt: number,
    dateToInt: number,
    interval: KlineInterval,
    symbol: string,
}

export interface ItemsOutputItem {
    symbol: string,
    startTime: number,
    endTime: number,
    interval: KlineInterval,
}

export interface CandlesInput {
    interval: KlineInterval,
    symbol: string,
}

