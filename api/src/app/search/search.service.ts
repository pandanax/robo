import {ElasticsearchService} from '@nestjs/elasticsearch';
import {Injectable} from '@nestjs/common';
import {CandleInput} from '../binance/binance.inputs';
import {IndicesRefreshRequest} from '@elastic/elasticsearch/lib/api/types';
import * as dayjs from 'dayjs';
import {makeSymbolTickerIndex} from '../binance/helpers/spotSymbolTicker.helper';
import {ICandleRequest, ISymbolInterval} from '../binance/types/candle.types';

@Injectable()
export class SearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}
    async index(p) {
        return this.elasticsearchService.index(p);
    }

    async indicesRefresh(p: IndicesRefreshRequest) {
        return this.elasticsearchService.indices.refresh(p);
    }

    async searchCandles({symbol, interval, dateFrom, dateTo}: ICandleRequest) {
        const index = makeSymbolTickerIndex({symbol, interval});
        return this.elasticsearchService.search({
            index,
            from : 0,
            size : 1000,
            query: {
                range: {
                    openTime: {
                        gte: dayjs(dateFrom).valueOf(),
                        lte: dayjs(dateTo).valueOf(),
                    }
                }
            }
        });
    }

    async deleteByQuery({symbol, interval}: ISymbolInterval) {
        const index = makeSymbolTickerIndex({symbol, interval});
        return this.elasticsearchService.deleteByQuery({
            index,
            query: {
                match_all: {}
            }
        }, {});
    }

}
