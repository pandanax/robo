import {Args, Query, Resolver, Subscription} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {PubSub} from 'graphql-subscriptions';
import {BinanceService} from './binance.service';
import {GqlAuthGuard} from '../auth/gql-jwt-auth.guard';
import {CurrentUser} from '../auth/auth.decorator';
import {GqlExchangeInfo, UniversalResponse} from './types/getExchangeInfo.types';
import {mapSymbols} from './helpers/getExchangeInfo.helper';
import {binanceWsClient} from './binance.ws.client';
import {Candles, UniversalBulkResponse, SpotSymbolTicker} from './types/spotSymbolTicker.types';
import {makeCandleId, makeSymbolTickerIndex} from './helpers/spotSymbolTicker.helper';
import {SearchService} from '../search/search.service';
import * as dayjs from 'dayjs'
import {CandleIndexInput, CandleInput, DeleteCandlesBulkInput, DeleteCandlesBulkInputByIds} from './binance.inputs';
import {concatMap, finalize, from, map, switchMap} from 'rxjs';
import {getItems, makeCollectCandlesResult, prepareCandles} from './helpers/candles.helper';


@Resolver()
export class BinanceResolver {
    constructor(
        private binanceService: BinanceService,
        private elasticsearchService: SearchService
    ) {
    }

    @Query(() => Candles)
    async searchCandles(@Args('payload') {symbol, interval, dateFrom, dateTo}: CandleInput) {
        const result = await this.elasticsearchService.searchCandles({symbol, interval, dateFrom, dateTo});
        return {items: result.hits.hits.map(({_source}) => _source)}
    }

    @Query(() => UniversalBulkResponse)
    async deleteBulkCandles(@Args('payload') {symbol, interval}: DeleteCandlesBulkInput) {
        const {failures, deleted} = await this.elasticsearchService.deleteByQuery({symbol, interval});
        return {
            message: `ERROR: ${failures.length}, SUCCESS: ${deleted}`
        };
    }

    @Subscription((returns) => UniversalBulkResponse, {
        name: 'subscribeCollectTickersData',
    })
    subscribeCollectTickersData(@Args('payload') {
        symbol,
        interval,
        dateFrom,
        dateTo,
    }: CandleInput) {

        // init pubSup
        const pubSub = new PubSub();
        const iterator = pubSub.asyncIterator('subscribeCollectTickersData');

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

        const source = from(items);

        source.pipe(
            concatMap(async ({
                                 symbol,
                                 interval,
                                 startTime,
                                 endTime,
                             }) => {
                // получаем свечки
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

                // собираем поштучно массив промисов для индексации
                const promises = candles.map(document => this.elasticsearchService.index({
                        index: makeSymbolTickerIndex({symbol, interval}),
                        id: makeCandleId({symbol, interval, openTime: document.openTime }),
                        document,
                    })
                );

                return makeCollectCandlesResult(candles, promises);
            }),
            finalize(async () => {
                return pubSub.publish('subscribeCollectTickersData', {
                    'subscribeCollectTickersData': {
                        message: 'DONE',
                    }
                });
            })
        ).subscribe(async ({message}) => {
                await pubSub.publish('subscribeCollectTickersData', {
                    'subscribeCollectTickersData': {
                        message,
                    }
                });
            });
        return iterator;
    }

}
