import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class SpotSymbolTicker {
    @Field(() => String)
    eventType: string
    @Field(() => Number)
    eventTime: number
    @Field(() => String)
    symbol: string
    @Field(() => Number)
    priceChange: number
    @Field(() => Number)
    priceChangePercent: number
    @Field(() => Number)
    weightedAveragePrice: number
    @Field(() => Number)
    previousClose: number
    @Field(() => Number)
    currentClose: number
    @Field(() => Number)
    closeQuantity: number
    @Field(() => Number)
    bestBid: number
    @Field(() => Number)
    bestBidQuantity: number
    @Field(() => Number)
    bestAskPrice: number
    @Field(() => Number)
    bestAskQuantity: number
    @Field(() => Number)
    open: number
    @Field(() => Number)
    high: number
    @Field(() => Number)
    low: number
    @Field(() => Number)
    baseAssetVolume: number
    @Field(() => Number)
    quoteAssetVolume: number
    @Field(() => Number)
    openTime: number
    @Field(() => Number)
    closeTime: number
    @Field(() => Number)
    firstTradeId: number
    @Field(() => Number)
    lastTradeId: number
    @Field(() => Number)
    trades: number
    @Field(() => String)
    wsMarket: string
    @Field(() => String)
    wsKey: string
}

@ObjectType()
export class Candle {
    @Field(() => String)
    symbol: string
    @Field(() => String)
    interval: string
    @Field(() => Number)
    openTime: number
    @Field(() => Number)
    high: number
    @Field(() => Number)
    low: number
    @Field(() => Number)
    open: number
    @Field(() => Number)
    close: number
    @Field(() => Number)
    volume: number
    @Field(() => Number)
    closeTime: number
}

@ObjectType()
export class Candles {
    @Field(() => [Candle])
    items: [Candle]
}

@ObjectType()
export class SpotSymbolTickers {
    @Field(() => [SpotSymbolTicker])
    items: [SpotSymbolTicker]
}
