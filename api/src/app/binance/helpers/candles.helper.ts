import * as dayjs from 'dayjs';
import {KlineInterval} from 'binance/lib/types/shared';
import {ICandle, ICandleRequest} from '../types/candle.types';
import {concatMap, finalize, from} from 'rxjs';
import {makeCandleId, makeSymbolTickerIndex} from './spotSymbolTicker.helper';
import {PubSub} from 'graphql-subscriptions';
import {PubSubAsyncIterator} from 'graphql-subscriptions/dist/pubsub-async-iterator';

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

const MAP_SYMBOLS = {
    'm': 'hour',
    'h': 'day',
    'd': 'month',
    'M': 'year',
}

// подаем интервал свечей типа 1d
// если качаем минутки - то берем часы
// если качаем часы то берем дни
// если качаем дни то берем месяцы
// если качаем месяцы то берем годы

export const getItems = ({
                             dateFromInt,
                             dateToInt,
                             symbol,
                             interval
                         }: ItemsInput): ItemsOutputItem[] => {
    const dates = getDates({
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

export const getDates = ({
                             dateFromInt,
                             dateToInt,
                             interval
                         }: DatesInput) => {
    let currentDateInt = dateFromInt;
    const dates = [];

    const intervalSymbol: string = interval.slice(-1);

    const unit = MAP_SYMBOLS[intervalSymbol];


    while (currentDateInt < dateToInt) {
        const newCurrentDateInt = dayjs(currentDateInt).add(1, unit).valueOf();
        const endTime = newCurrentDateInt > dateToInt ? dateToInt : newCurrentDateInt;
        const item = {
            startTime: currentDateInt,
            endTime: endTime - 1,
        }
        dates.push(item);


            console.log(dayjs(item.startTime).toISOString())
            console.log(dayjs(item.endTime).toISOString())
            console.log('-----')


        currentDateInt = newCurrentDateInt;
    }

    return dates;
}

export const prepareCandles = (candlesRaw: any[][], {
    symbol,
    interval,
}: CandlesInput): ICandle[] => {
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

export const makeCollectCandlesResult = async (candles: ICandle[], promises: Promise<any>[]) => {

    // пишем в БД
    const result = await Promise.all(promises);

    // собираем ответку
    const messageObj = result.reduce((acc, {result}, i) => {
        const key = dayjs(candles[i].openTime).toISOString();
        acc[key] = result;
        return acc;
    }, {});

    return {
        message: JSON.stringify(messageObj),
    };
}
