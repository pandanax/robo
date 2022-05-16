import { Module } from '@nestjs/common';

import { MongoModule } from '../database/mongo/mongo.module';
import { GqlModule } from '../database/gql/gql.module';
import { PersonModule } from './person/person.module';
import { HobbyModule } from './hobby/hobby.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BinanceModule } from './binance/binance.module';

@Module({
  imports: [
    //database
    MongoModule,
    GqlModule,
    //entities
    PersonModule,
    HobbyModule,
    AuthModule,
    UsersModule,
    BinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
