import {OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor} from '@nestjs/bull';
import {Logger} from '@nestjs/common';
import {Job} from 'bull';
import {catchError, concatMap, EMPTY, finalize, from} from 'rxjs';
import * as dayjs from 'dayjs';
import {BinanceService} from '../binance/binance.service';
import {SearchService} from '../search/search.service';
import {ICandleRequest} from './candle.types';
import {CandleService} from './candle.service';
import {makeCandleId, makeSymbolTickerIndex} from './candle.constants';

@Processor('candle')
export class CandleProcessor {
    private readonly logger = new Logger(CandleProcessor.name);

    constructor(
        private binanceService: BinanceService,
        private elasticsearchService: SearchService,
        private candleService: CandleService,
    ) {
    }

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(
            `Activating job id:${job.id} of type ${job.name}...`,
        );
    }

    @OnQueueFailed()
    onFailed(job: Job, error: Error) {
        this.logger.error(
            `Error job id:${job.id} of type ${job.name} with error ${error}`,
        );
    }

    @OnQueueCompleted()
    onCompleted(job: Job, result: any) {
        this.logger.debug(
            `Completed job id:${job.id} of type ${job.name} with result ${JSON.stringify(result)}`,
        );
    }

    @Process('collectCandle')
    async collectCandle(job: Job<ICandleRequest>) {

        this.logger.debug('Стартуем джобу сбора свечей с параметрами:');
        this.logger.debug(job.data);

        const {
            dateFrom,
            dateTo,
            interval,
            symbol,
        } = job.data;

        // распарсим даты
        const dateFromInt = dayjs(dateFrom).valueOf();
        const dateToInt = dayjs(dateTo).valueOf();

        // получим айтемы для создания потока из массива
        const items = this.candleService.getItems({
            dateFromInt,
            dateToInt,
            interval,
            symbol,
        })

        const source = from(items);

        const elasticSearchIndex = makeSymbolTickerIndex({symbol, interval});

        return new Promise((resolve, reject) => {
            return source.pipe(
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
                    const candles = this.candleService.prepareCandles(candlesRaw, {
                        symbol,
                        interval,
                    });

                    // собираем поштучно массив промисов для индексации
                    const promises = candles.map(document => this.elasticsearchService.index({
                            index: elasticSearchIndex,
                            id: makeCandleId({symbol, interval, openTime: document.openTime}),
                            document,
                        })
                    );

                    // Пишем в эластик
                    const results = await Promise.all(promises);

                    return  this.candleService.makeCollectCandlesResult(candles, results);
                }),
                finalize(async () => {
                    const updateIndexResult = await this.elasticsearchService.indicesRefresh({
                        index: elasticSearchIndex,
                        allow_no_indices: false,
                    })
                    return resolve({updateIndexResult});
                }),
                catchError((err: any) => {
                    reject(err);
                    return EMPTY;
                })
            ).subscribe((r) => {
                this.logger.debug(r);
            })
        })
    }

}
