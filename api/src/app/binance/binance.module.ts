import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceResolver } from './binance.resolver';
import {SearchModule} from '../search/search.module';

@Module({
  imports: [HttpModule, SearchModule],
  providers: [BinanceService, BinanceResolver]
})
export class BinanceModule {}
