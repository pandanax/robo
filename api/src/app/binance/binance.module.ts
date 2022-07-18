import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceResolver } from './binance.resolver';

@Module({
  imports: [HttpModule],
  providers: [BinanceService, BinanceResolver],
  exports: [BinanceService]
})
export class BinanceModule {}
