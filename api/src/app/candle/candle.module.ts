import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CandleService } from './candle.service';
import {CandleProcessor} from './candle.processor';
import {BinanceModule} from '../binance/binance.module';
import {SearchModule} from '../search/search.module';
import { CandleResolver } from './candle.resolver';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'candle',
        }),
        BinanceModule,
        SearchModule
    ],
    providers: [CandleService, CandleProcessor, CandleResolver],
    exports: [CandleService],
})
export class CandleModule {}
