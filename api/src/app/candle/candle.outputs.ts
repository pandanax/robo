import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class Candle {
    @Field(() => String)
    id: string
    @Field(() => String)
    symbol: string
    @Field(() => String)
    interval: string
    @Field(() => String)
    openTime: number
    @Field(() => Number)
    high: number
    @Field(() => Number)
    low: number
    @Field(() => Number)
    open: number
    @Field(() => Number)
    close: number
    @Field(() => Number)
    volume: number
    @Field(() => String)
    closeTime: number
}

@ObjectType()
export class Candles {
    @Field(() => [Candle])
    items: [Candle]
}

@ObjectType()
export class UniversalCandleJobResponse {
    @Field(() => Number)
    id: number
    @Field(() => Number)
    timestamp: number
    @Field(() => String)
    name: string
}

