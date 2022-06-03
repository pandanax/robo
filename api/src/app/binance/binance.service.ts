import {Injectable} from '@nestjs/common';
import {ExchangeInfo, GetOrderParams, SpotOrder} from 'binance';
import 'dotenv/config';
import {binanceClient} from './binance.client';
import {KlinesParams} from 'binance/lib/types/shared';
import {ExtendedSpotOrder} from './types/getKlines.types';

@Injectable()
export class BinanceService {

    getExchangeInfo(): Promise<void | ExchangeInfo> {
        return binanceClient.getExchangeInfo()
    }
    getKlines({symbol, interval, startTime, endTime, limit }: KlinesParams): Promise<Array<Array<any>>> {
        return binanceClient.getKlines({symbol, interval, startTime, endTime, limit });
    }

}
