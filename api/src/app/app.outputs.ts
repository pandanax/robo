import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class UniversalBulkResponse {
    @Field(() => String)
    status?: number
    @Field(() => Number)
    statusCode?: number
    @Field(() => String)
    message?: string
}
