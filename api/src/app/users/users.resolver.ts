import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../auth/gql-jwt-auth.guard';
import {User} from './users.model';
import {CurrentUser} from '../auth/auth.decorator';
import {UsersService} from './users.service';
import {Person} from '../person/person.model';
import {CreatePersonInput} from '../person/person.inputs';
import {RegisterUserInput} from './users.inputs';

@Resolver(() => User)
export class UsersResolver {
    constructor(private usersService: UsersService) {
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    whoAmI(@CurrentUser() user: {userId: string}) {
        return this.usersService.findByIdNoPass(user.userId);
    }

    @Mutation(() => User)
    async register(@Args('payload') payload: RegisterUserInput) {
        return this.usersService.register(payload);
    }
}
