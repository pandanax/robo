import {Field, InputType} from '@nestjs/graphql';
import {KlineInterval} from 'binance/lib/types/shared';
import Bull from 'bull';

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
export class CandleIndexInput {

    @Field(() => String)
    interval: KlineInterval;

    @Field(() => String)
    symbol: string;

}

@InputType()
export class JobIdInput {

    @Field(() => Number)
    id: Bull.JobId;

}
