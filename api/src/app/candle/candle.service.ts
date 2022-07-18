import {Injectable, Logger} from '@nestjs/common';
import {InjectQueue} from '@nestjs/bull';
import Bull, {Queue} from 'bull';
import {CandlesInput, DatesInput, ICandle, ICandleRequest, ItemsInput, ItemsOutputItem} from './candle.types';
import * as dayjs from 'dayjs';
import {UniversalBulkResponse} from '../app.outputs';
import {MAP_SYMBOLS} from './candle.constants';

@Injectable()
export class CandleService {
    private readonly logger = new Logger(CandleService.name)
    constructor(@InjectQueue('candle') private readonly candleQueue: Queue) {
    }

    async addCollectCandlesJob({
                                   interval,
                                   symbol,
                                   dateFrom,
                                   dateTo,
                               }: ICandleRequest) {
        return this.candleQueue.add('collectCandle', {
            interval,
            symbol,
            dateFrom,
            dateTo,
        });
    }

    async getJobStatusCollectTickersData(id: Bull.JobId) {
        return this.candleQueue.getJob(id);
    }

    getItems({
                 dateFromInt,
                 dateToInt,
                 symbol,
                 interval
             }: ItemsInput): ItemsOutputItem[] {
        const dates = this.getDates({
            dateToInt,
            dateFromInt,
            interval,
        })
        return dates.map((
            {
                startTime,
                endTime,
            }) => ({
            symbol,
            startTime,
            endTime,
            interval,
        }));
    }

    getDates({
                 dateFromInt,
                 dateToInt,
                 interval
             }: DatesInput) {
        let currentDateInt = dateFromInt;
        const dates = [];

        const intervalSymbol: string = interval.slice(-1);

        const unit = MAP_SYMBOLS[intervalSymbol];

        let counter = 0;

        while (currentDateInt < dateToInt) {
            const newCurrentDateInt = dayjs(currentDateInt).add(1, unit).valueOf();
            const endTime = newCurrentDateInt > dateToInt ? dateToInt : newCurrentDateInt;
            const item = {
                startTime: currentDateInt,
                endTime: endTime - 1,
            }
            dates.push(item);
            counter++;

            this.logger.debug(`Даты для первого запроса ${counter}`)
            this.logger.debug({
                from: dayjs(item.startTime).toISOString(),
                to: dayjs(item.endTime).toISOString(),
            })

            currentDateInt = newCurrentDateInt;
        }

        return dates;
    }

    prepareCandles(candlesRaw: any[][], {
        symbol,
        interval,
    }: CandlesInput): ICandle[] {
        return candlesRaw.map((
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
            openTime: dayjs(openTime).valueOf(),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
            closeTime: dayjs(closeTime).valueOf(),
            quoteAssetVolume,
            numberOfTrades,
            takerBuyBaseAssetVolume,
            takerBuyQuoteAssetVolume,
        } as ICandle));
    }

    async makeCollectCandlesResult(candles: ICandle[], results: {result: string}[]): Promise<UniversalBulkResponse> {
        // собираем ответку
        const messageObj = results.reduce((acc, {result}, i) => {
            const candleDate = dayjs(candles[i].openTime).toISOString();
            if (!acc[result]) {
                acc[result] = 0;
            }
            acc[result]++;
            acc.candleDates.push(`${candleDate}: ${result}`);
            return acc;
        }, {created: 0, updated: 0, candleDates: []});

        return {
            message: JSON.stringify(messageObj),
        };
    }
}
