import {ElasticsearchService} from '@nestjs/elasticsearch';
import {Injectable} from '@nestjs/common';
import {
    IndicesCreateRequest,
    IndicesDeleteRequest,
    IndicesGetRequest,
    IndicesRefreshRequest
} from '@elastic/elasticsearch/lib/api/types';
import * as dayjs from 'dayjs';
import {ICandleRequest, ISymbolInterval} from '../candle/candle.types';
import {makeSymbolTickerIndex} from '../candle/candle.constants';

@Injectable()
export class SearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}
    async index(p) {
        return this.elasticsearchService.index(p);
    }

    async indicesRefresh(p: IndicesRefreshRequest) {
        return this.elasticsearchService.indices.refresh(p);
    }

    async indicesCreate(p: IndicesCreateRequest ) {
        return this.elasticsearchService.indices.create(p);
    }

    async indicesDelete(p: IndicesDeleteRequest ) {
        return this.elasticsearchService.indices.delete(p);
    }

    async indicesGet(p: IndicesGetRequest) {
        return this.elasticsearchService.indices.get(p);
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
