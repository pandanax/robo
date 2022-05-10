import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {AuthenticationError} from 'apollo-server-express';
import {AuthJwtPayload, AuthPayload} from './auth.types';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string): Promise<AuthJwtPayload | null> {

        const user = await this.usersService.findOne({email: username});

        const isValid = await bcrypt.compare(pass, user.password);

        if (!isValid) {
            throw new AuthenticationError('Wrong email or password')
        }

        return {
            email: user.email,
            id: `${user._id}`, // convert to string
        };

    }

    async login(user: AuthJwtPayload): Promise<AuthPayload> {
        const payload = { username: user.email, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
