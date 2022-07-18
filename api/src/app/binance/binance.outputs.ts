import {Field, ObjectType} from '@nestjs/graphql';
import {ExchangeFilter, OrderType, RateLimiter} from 'binance/lib/types/shared';
import {SymbolExchangeInfo} from 'binance';

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
export class SpotSymbolTickers {
    @Field(() => [SpotSymbolTicker])
    items: [SpotSymbolTicker]
}

@ObjectType()
class GqlRateLimiter {
    @Field(() => String)
    rateLimitType: 'REQUEST_WEIGHT' | 'ORDERS' | 'RAW_REQUESTS';
    @Field(() => String)
    interval: 'SECOND' | 'MINUTE' | 'DAY';
    @Field(() => Number)
    intervalNum: number;
    @Field(() => Number)
    limit: number;
}

@ObjectType()
class GqlExchangeFilter {
    @Field(() => String)
    filterType: string;
    @Field(() => Number, {nullable: true})
    maxNumOrders: number;
    @Field(() => Number, {nullable: true})
    maxNumAlgoOrders: number;
}

@ObjectType()
class GqlSymbolExchangeInfo {
    @Field(() => String)
    symbol: string;
    @Field(() => String)
    status: string;
    @Field(() => String)
    baseAsset: string;
    @Field(() => Number)
    baseAssetPrecision: number;
    @Field(() => String)
    quoteAsset: string;
    @Field(() => [String])
    orderTypes: OrderType[];
    @Field(() => Number)
    quoteAssetPrecision: number;
    @Field(() => Boolean)
    icebergAllowed: boolean;
    @Field(() => Boolean)
    ocoAllowed: boolean;
    @Field(() => Boolean)
    isSpotTradingAllowed: boolean;
    @Field(() => Boolean)
    isMarginTradingAllowed: boolean;
    @Field(() => String)
    filters: string;
}

@ObjectType()
export class GqlExchangeInfo {
    @Field(() => String)
    timezone: string
    @Field(() => Number)
    serverTime: number
    @Field(() => [GqlRateLimiter])
    rateLimits: RateLimiter[]
    @Field(() => [GqlExchangeFilter])
    exchangeFilters: ExchangeFilter[]
    @Field(() => [GqlSymbolExchangeInfo])
    symbols: SymbolExchangeInfo[]
}

