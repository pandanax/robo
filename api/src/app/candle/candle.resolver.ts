import {Args, Query, Resolver} from '@nestjs/graphql';
import {BinanceService} from '../binance/binance.service';
import {SearchService} from '../search/search.service';
import {CandleService} from './candle.service';
import {CandleIndexInput, CandleInput, JobIdInput} from './candle.inputs';
import {Candles, UniversalCandleJobResponse} from './candle.outputs';
import {UniversalResponse} from '../app.outputs';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../auth/gql-jwt-auth.guard';
import {DateService} from '../date/date.service';
import {makeSymbolIntervalFormIndex} from './candle.constants';
import * as dayjs from 'dayjs';

@Resolver()
export class CandleResolver {
    constructor(
        private binanceService: BinanceService,
        private elasticsearchService: SearchService,
        private candleService: CandleService,
        private dateService: DateService
    ) {
    }

    // создадим индексы если такого нет, создадим даты если таких нет
    @Query(() => UniversalResponse)
    @UseGuards(GqlAuthGuard)
    async scheduleAllCandleJobs() {
        const startDate = this.candleService.getGlobalStartDate();
        const indices = this.candleService.getIndices();

        try {

            const promisesGetDates = indices.map(p => this.dateService.findByIndex(p));

            const resultsGetDates = (await Promise.allSettled(promisesGetDates))
                // @ts-ignore
                .map((v, i) => v.value)
                .map(({index, lastUpdate}) => ({
                    index,
                    lastUpdate: lastUpdate || startDate
                }));

            console.log('----resultsGetDates', resultsGetDates);

            const dateTo = dayjs().toISOString();

            const addJobPromises = resultsGetDates.map(({index, lastUpdate}) => {
                console.log('---', index, lastUpdate)
                const {symbol, interval} = makeSymbolIntervalFormIndex(index);
                console.log('---', symbol, interval, this.candleService.addCollectCandlesJob)
                const dateFrom = dayjs(lastUpdate).toISOString();
                console.log('----dateFrom', dateFrom)

                return this.candleService.addCollectCandlesJob(
                    {
                        symbol,
                        interval,
                        dateFrom,
                        dateTo,
                    }
                )
            });

            console.log('-----addJobPromises', addJobPromises)

            const resultJobs = await Promise.all(addJobPromises);

            console.log('----resultJobs', resultJobs)

            return {
                message: JSON.stringify(resultJobs)
            }

        } catch (e) {
            console.error(e)
            return {
                message: e.toString()
            }
        }
    }

    // создадим индексы если такого нет, создадим даты если таких нет
    @Query(() => UniversalResponse)
    @UseGuards(GqlAuthGuard)
    async updateCandleIndices() {
        const indices = this.candleService.getIndices();

        const promisesGet = indices.map(p => this.elasticsearchService.indicesGet(p));

        // получили
        const resultsGet = (await Promise.allSettled(promisesGet)).map((v, i) => ({
            index: indices[i],
            value: v
        }));

        const promisesGetDates = indices.map(p => this.dateService.findByIndex(p));

        const resultsGetDates = (await Promise.allSettled(promisesGetDates)).map((v, i) => ({
            index: indices[i],
            value: v
        }));

        // досоздали те что не получили
        const promisesCreate = resultsGet
            .filter(({value}) => value.status === 'rejected')
            .map(({index}) => this.elasticsearchService.indicesCreate(index));

        const resultCreate = await Promise.allSettled(promisesCreate);


        // досоздали те что не получили даты
        const promisesCreateDate = resultsGetDates
            .filter(({value}) => value.status === 'rejected')
            .map(({index}) => this.dateService.createDate(index));

        const resultCreateDate = await Promise.allSettled(promisesCreateDate);

        return {
            message: JSON.stringify({resultsGet, resultCreate, resultsGetDates, resultCreateDate}),
        }
    }

    @Query(() => Candles)
    @UseGuards(GqlAuthGuard)
    async indexCandles(@Args('payload') {symbol, interval, dateFrom, dateTo}: CandleInput) {
        const result = await this.elasticsearchService.searchCandles({symbol, interval, dateFrom, dateTo});
        return {items: result.hits.hits.map(({_source}) => _source)}
    }

    @Query(() => Candles)
    @UseGuards(GqlAuthGuard)
    async searchCandles(@Args('payload') {symbol, interval, dateFrom, dateTo}: CandleInput) {
        const result = await this.elasticsearchService.searchCandles({symbol, interval, dateFrom, dateTo});
        return {items: result.hits.hits.map(({_source}) => _source)}
    }

    @Query(() => UniversalResponse)
    @UseGuards(GqlAuthGuard)
    async deleteBulkCandles(@Args('payload') {symbol, interval}: CandleIndexInput) {
        const {failures, deleted} = await this.elasticsearchService.deleteByQuery({symbol, interval});
        return {
            message: `ERROR: ${failures.length}, SUCCESS: ${deleted}`
        };
    }

    @Query(() => UniversalCandleJobResponse)
    @UseGuards(GqlAuthGuard)
    async collectTickersData(@Args('payload') {
        symbol,
        interval,
        dateFrom,
        dateTo,
    }: CandleInput) {

        const {id, name, timestamp} = await this.candleService.addCollectCandlesJob(
            {
                symbol,
                interval,
                dateFrom,
                dateTo,
            }
        )

        return {id, name, timestamp};
    }

    @Query(() => UniversalResponse)
    @UseGuards(GqlAuthGuard)
    async getJobStatusCollectTickersData(@Args('payload') {id}: JobIdInput) {
        const res = await this.candleService.getJobStatusCollectTickersData(id);
        let status = 'PENDING';
        let message = '';

        if (!res) {
            status = 'NOT_EXIST';
        } else {

            message = JSON.stringify(res);
            const {finishedOn, failedReason} = res;

            if (finishedOn && !failedReason) {
                status = 'SUCCESS';
            }

            if (failedReason) {
                status = 'ERROR';
            }
        }

        return {
            status,
            message,
        };
    }
}
