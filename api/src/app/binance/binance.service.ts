import {Injectable} from '@nestjs/common';
import {ExchangeInfo} from 'binance';
import {binanceClient} from './binance.client';
import {KlinesParams} from 'binance/lib/types/shared';

@Injectable()
export class BinanceService {

    getExchangeInfo(): Promise<void | ExchangeInfo> {
        return binanceClient.getExchangeInfo()
    }

    async getKlines({symbol, interval, startTime, endTime, limit}: KlinesParams): Promise<Array<Array<any>>> {
        let res;
        try {
             res = await binanceClient.getKlines({symbol, interval, startTime, endTime, limit});
        } catch (e) {
            console.log('errr', e)
        }
        return res
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
