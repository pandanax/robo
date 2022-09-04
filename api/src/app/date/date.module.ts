import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { DateService } from './date.service';
import { DateResolver } from './date.resolver';
import {DateSchema, Date} from './date.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Date.name,
        schema: DateSchema,
      },
    ]),
  ],
  providers: [DateService, DateResolver],
  exports: [DateService],
})
export class DateModule {}
