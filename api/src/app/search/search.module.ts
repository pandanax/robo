import { Module } from '@nestjs/common';
import {ElasticsearchModule} from '@nestjs/elasticsearch';
import 'dotenv/config';
import {SearchService} from './search.service';

@Module({
    imports: [ElasticsearchModule.register({
        node: process.env.SEARCH_DB_CONN_STRING,
    })],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule {}
