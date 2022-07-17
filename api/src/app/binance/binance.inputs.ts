import {Field, InputType} from '@nestjs/graphql';
import {KlineInterval} from 'binance/lib/types/shared';
import {Schema as MongooseSchema} from 'mongoose';

@InputType()
export class CandleInput {
@Field(() => String)
    symbol: string;

@Field(() => String)
    interval: KlineInterval;

@Field(() => String)
    dateFrom: string;

@Field(() => String)
    dateTo: string;
}

@InputType()
export class DeleteCandlesBulkInputByIds {

@Field(() => [String])
    ids: string[];

@Field(() => String)
    interval: KlineInterval;

@Field(() => String)
    symbol: string;

}

@InputType()
export class DeleteCandlesBulkInput {

    @Field(() => String)
    interval: KlineInterval;

    @Field(() => String)
    symbol: string;

}

@InputType()
export class CandleIndexInput {
    @Field(() => String)
    symbol: string;

    @Field(() => String)
    interval: KlineInterval;
}
