import * as dayjs from 'dayjs';
import {KlineInterval} from 'binance/lib/types/shared';

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
        dates.push({
            startTime: currentDateInt,
            endTime: newCurrentDateInt > dateToInt ? dateToInt : newCurrentDateInt
        });
        currentDateInt = newCurrentDateInt;
    }

    return dates;
}

export const prepareCandles = (candlesRaw: any[][], {
    symbol,
    interval,
}: CandlesInput) => {
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
}
