import { Module } from '@nestjs/common';

import { MongoModule } from '../database/mongo/mongo.module';
import { GqlModule } from '../database/gql/gql.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BinanceModule } from './binance/binance.module';
import { SearchModule } from './search/search.module';
import { BullModule } from './bull/bull.module';
import { CandleModule } from './candle/candle.module';

@Module({
  imports: [
    //database
    MongoModule,
    GqlModule,
    SearchModule,
    BullModule,
    //external API
    BinanceModule,
    //internal Modules
    AuthModule,
    UsersModule,
    CandleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
