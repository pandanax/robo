import {Args, Query, Resolver, Subscription} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {PubSub} from 'graphql-subscriptions';
import {BinanceService} from './binance.service';
import {GqlAuthGuard} from '../auth/gql-jwt-auth.guard';
import {CurrentUser} from '../auth/auth.decorator';
import {GqlExchangeInfo} from './types/getExchangeInfo.types';
import {mapSymbols} from './helpers/getExchangeInfo.helper';
import {binanceWsClient} from './binance.ws.client';
import {Candles, CollectTickersData, SpotSymbolTicker} from './types/spotSymbolTicker.types';
import {makeSymbolTickerIndex} from './helpers/spotSymbolTicker.helper';
import {SearchService} from '../search/search.service';
import * as dayjs from 'dayjs'
import {CandleInput} from './binance.inputs';
import {concatMap, from, map} from 'rxjs';
import {getDates, getItems, prepareCandles} from './helpers/candles.helper';


@Resolver()
export class BinanceResolver {
    constructor(
        private binanceService: BinanceService,
        private elasticSearchService: SearchService
    ) {
    }

    @Query(() => Candles)
    async getCandles(@Args('payload') {symbol = 'BTCUSDT', interval = '1d', dateFrom, dateTo}: CandleInput) {
        const index = makeSymbolTickerIndex({symbol, interval});
        const {body} = await this.elasticSearchService.search({
            symbol,
            index,
            openTimeFrom: dayjs(dateFrom).valueOf(),
            openTimeTo: dayjs(dateTo).valueOf(),
        });
        return {items: body.hits.hits.map(({_source}) => _source)}
    }

    @Query(() => GqlExchangeInfo)
    @UseGuards(GqlAuthGuard)
    getExchangeInfo(@CurrentUser() user: { userId: string }) {
        return this.binanceService.getExchangeInfo().then(mapSymbols);
    }


    @Subscription((returns) => CollectTickersData, {
        name: 'subscribeCollectTickersData',
    })
    subscribeCollectTickersData(@Args('payload') {
        symbol = 'BTCUSDT',
        interval = '1d',
        dateFrom = dayjs().subtract(1, 'day').toISOString(),
        dateTo = dayjs().toISOString(),
    }: CandleInput) {

        // init pubSup
        const pubSub = new PubSub();

        // распарсим даты
        const dateFromInt = dayjs(dateFrom).valueOf();
        const dateToInt = dayjs(dateTo).valueOf();

        // получим айтемы для создания потока из массива
        const items = getItems({
            dateFromInt,
            dateToInt,
            interval,
            symbol,
        })

        items.forEach(item => {
            console.log(dayjs(item.startTime).toISOString())
            console.log(dayjs(item.endTime).toISOString())
        });

        const source = from(items);

        source.pipe(concatMap(async ({
                                    symbol,
                                    interval,
                                    startTime,
                                    endTime,
                                }) => {

            // свечки
            const candlesRaw = await this.binanceService.getKlines({
                symbol,
                interval,
                startTime,
                endTime,
            });

            // обработанные свечки
            const candles = prepareCandles(candlesRaw, {
                symbol,
                interval,
            });

            // индекс для БД
            const index = makeSymbolTickerIndex({symbol, interval});
            // тело для БД
            const body = candles.flatMap(doc => [{index: {_index: index}}, doc])
            // пишем в БД
            const res = await this.elasticSearchService.index(body);

            //console.log('--res', res);


            const result = `SUCCESS ${candles.length} ${interval} ${symbol}: ${dayjs(startTime).toISOString()}-${dayjs(endTime).toISOString()}`

            return result
        })).subscribe(async (result) => {
            const res = await result;
            return pubSub.publish('subscribeCollectTickersData', {
                'subscribeCollectTickersData': {
                    result: res
                }
            });
        });


        // from(items).subscribe((item) => {
        //     console.log('---', item)
        //     return pubSub.publish('subscribeCollectTickersData', {'subscribeCollectTickersData': {
        //             eventType: item,
        //             eventTime: 1,
        //         }});
        // });
        return pubSub.asyncIterator('subscribeCollectTickersData');
    }

    @Subscription((returns) => SpotSymbolTicker, {
        name: 'subscribeSpotSymbol24hrTicker',
    })
    subscribeSpotSymbol24hrTicker() {
        const self = this;
        const pubSub = new PubSub();

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
