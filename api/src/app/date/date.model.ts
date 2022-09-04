import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class Date {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  index: string;

  @Field(() => String)
  @Prop()
  symbol: string;

  @Field(() => String)
  @Prop()
  interval: string;

  @Field(() => String)
  @Prop()
  lastUpdate: string;
}

export type DateDocument = Date & Document;

export const DateSchema = SchemaFactory.createForClass(Date);
