import {
  Args,
  Context,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlLocalAuthGuard } from './gql-local-auth.guard';
import { AuthInput } from './auth.inputs';

@ObjectType()
export class Auth {
  @Field(() => String)
  accessToken: string;
}

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(GqlLocalAuthGuard)
  @Mutation(() => Auth)
  async login(@Context() ctx, @Args('payload') payload: AuthInput) {
    return this.authService.login(ctx.req.user);
  }
}
