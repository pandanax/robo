import { Field, InputType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class GetDateInput {
    @Field(() => String)
    symbol: string;

    @Field(() => String)
    interval: string;
}
