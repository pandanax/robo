import { Field, InputType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class RegisterUserInput {

    @Field(() => String)
    email: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    @Field(() => String)
    password: string;
}

@InputType()
export class AuthUserInput {

    @Field(() => String)
    email: string;

    @Field(() => [String])
    password: string;
}

@InputType()
export class GetUserInput {

    @Field(() => String)
    _id?: MongooseSchema.Types.ObjectId;

    @Field(() => String, { nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    firstName?: string;

    @Field(() => String, { nullable: true })
    lastName?: string;

}

@InputType()
export class UpdateUserNameInput {
    @Field(() => String)
    _id: MongooseSchema.Types.ObjectId;

    @Field(() => String, { nullable: true })
    firstName?: string;

    @Field(() => String, { nullable: true })
    lastName?: string;
}
