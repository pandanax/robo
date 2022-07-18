import {Injectable} from '@nestjs/common';
import {ExchangeInfo} from 'binance';
import {binanceClient} from './binance.client';
import {KlinesParams} from 'binance/lib/types/shared';

@Injectable()
export class BinanceService {

    getExchangeInfo(): Promise<void | ExchangeInfo> {
        return binanceClient.getExchangeInfo()
    }

    getKlines({symbol, interval, startTime, endTime, limit}: KlinesParams): Promise<Array<Array<any>>> {
        return binanceClient.getKlines({symbol, interval, startTime, endTime, limit});
    }

    mapSymbols(r: ExchangeInfo) {
        return {
            ...r,
            symbols: r.symbols.map(s => ({
                ...s,
                filters: JSON.stringify(s.filters)
            }))
        }
    }


}
