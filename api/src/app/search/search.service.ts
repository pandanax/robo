import { Injectable } from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';

interface SearchDocument {
    index?: string,
    globalIndex?: string,
    symbol?: string,
    openTimeFrom?: number,
    openTimeTo?: number,
}

@Injectable()
export class SearchService {
    constructor(private readonly client: ElasticsearchService) {}
    index(body) {

        return this.client.bulk({
            refresh: true,
            body,
        })

    }
    search({index, symbol, openTimeFrom, openTimeTo}: SearchDocument) {
        return this.client.search({
            index,
            body: {
                query: {
                    /*match: {
                        symbol,
                    },*/
                    range: {
                        openTime : {
                            gte : openTimeFrom,
                            lte : openTimeTo
                        }
                    }
                }
            }
        })
    }

}
