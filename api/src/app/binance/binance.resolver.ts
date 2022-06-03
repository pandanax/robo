import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {PubSub} from 'graphql-subscriptions';
import {BinanceService} from './binance.service';
import {GqlAuthGuard} from '../auth/gql-jwt-auth.guard';
import {CurrentUser} from '../auth/auth.decorator';
import {GqlExchangeInfo, UniversalResponse} from './types/getExchangeInfo.types';
import {mapSymbols} from './helpers/getExchangeInfo.helper';
import {binanceWsClient} from './binance.ws.client';
import {Candles, SpotSymbolTicker} from './types/spotSymbolTicker.types';
import {makeSymbolTickerIndex} from './helpers/spotSymbolTicker.helper';
import {SearchService} from '../search/search.service';
import * as dayjs from 'dayjs'
import {CandleInput} from './binance.inputs';

const pubSub = new PubSub();


@Resolver()
export class BinanceResolver {
    constructor(
        private binanceService: BinanceService,
        private elasticSearchService: SearchService
    ) {
    }

    @Query(() => Candles)
    async getCandles(@Args('payload') {symbol = 'BTCUSDT', interval = '1d'}: CandleInput) {
        const index = makeSymbolTickerIndex({symbol, interval});
        const {body} = await this.elasticSearchService.search({
            symbol,
            index,
        });
        return {items: body.hits.hits.map(({_source}) => _source)}
    }

    @Query(() => GqlExchangeInfo)
    @UseGuards(GqlAuthGuard)
    getExchangeInfo(@CurrentUser() user: { userId: string }) {
        return this.binanceService.getExchangeInfo().then(mapSymbols);
    }

    @Mutation(() => UniversalResponse)
    async storeCandles(@Args('payload') {symbol = 'BTCUSDT', interval = '1d'}: CandleInput) {

        const candlesRaw = await this.binanceService.getKlines({
            symbol,
            interval,
            startTime: dayjs().subtract(30, 'day').valueOf(),
            endTime: dayjs().valueOf(),
        });

        const candles = candlesRaw.map((
            [
                openTime,
                open,
                high,
                low,
                close,
                volume,
                closeTime,
                quoteAssetVolume,
                numberOfTrades,
                takerBuyBaseAssetVolume,
                takerBuyQuoteAssetVolume,
            ]) => ({
            symbol,
            interval,
            openTime,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
            closeTime,
            quoteAssetVolume,
            numberOfTrades,
            takerBuyBaseAssetVolume,
            takerBuyQuoteAssetVolume,
        }));

        const index = makeSymbolTickerIndex({symbol, interval});
        const body = candles.flatMap(doc => [{index: {_index: index}}, doc])

        return this.elasticSearchService.index(body)

    }


    @Subscription((returns) => SpotSymbolTicker, {
        name: 'subscribeSpotSymbol24hrTicker',
    })
    subscribeSpotSymbol24hrTicker() {
        const self = this;
        binanceWsClient.subscribeSpotSymbol24hrTicker('BTCUSDT');
        binanceWsClient.on('open', (data) => {
            console.log('connection opened open:', data.wsKey, data.ws.target.url);
        });
        binanceWsClient.on('formattedMessage', async (
            data: SpotSymbolTicker) => {
            return pubSub.publish('subscribeSpotSymbol24hrTicker', {'subscribeSpotSymbol24hrTicker': data});
        });
        return pubSub.asyncIterator('subscribeSpotSymbol24hrTicker');
    }
}
