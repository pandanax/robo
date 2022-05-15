import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

@Module({
  imports: [MongooseModule.forRoot(process.env.DB_CONN_STRING)],
})
export class MongoModule {}
