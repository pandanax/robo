import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import {GqlExecutionContext} from '@nestjs/graphql';
import {AuthenticationError} from 'apollo-server-express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
