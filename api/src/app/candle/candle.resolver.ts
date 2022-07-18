import {Args, Query, Resolver} from '@nestjs/graphql';
import {BinanceService} from '../binance/binance.service';
import {SearchService} from '../search/search.service';
import {CandleService} from './candle.service';
import {CandleInput, DeleteCandlesBulkInput, JobIdInput} from './candle.inputs';
import {Candles, UniversalCandleJobResponse} from './candle.outputs';
import {UniversalBulkResponse} from '../app.outputs';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../auth/gql-jwt-auth.guard';

@Resolver()
export class CandleResolver {
    constructor(
        private binanceService: BinanceService,
        private elasticsearchService: SearchService,
        private candleService: CandleService
    ) {
    }

    @Query(() => Candles)
    @UseGuards(GqlAuthGuard)
    async searchCandles(@Args('payload') {symbol, interval, dateFrom, dateTo}: CandleInput) {
        const result = await this.elasticsearchService.searchCandles({symbol, interval, dateFrom, dateTo});
        return {items: result.hits.hits.map(({_source}) => _source)}
    }

    @Query(() => UniversalBulkResponse)
    @UseGuards(GqlAuthGuard)
    async deleteBulkCandles(@Args('payload') {symbol, interval}: DeleteCandlesBulkInput) {
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

    @Query(() => UniversalBulkResponse)
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
