import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class UniversalResponse {
    @Field(() => String)
    status?: number
    @Field(() => Number)
    statusCode?: number
    @Field(() => String)
    message?: string
}
