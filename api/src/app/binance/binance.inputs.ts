import {Field, InputType} from '@nestjs/graphql';
import {KlineInterval} from 'binance/lib/types/shared';

@InputType()
export class CandleInput {
@Field(() => String)
    symbol: string;

@Field(() => String)
    interval: KlineInterval;
}
