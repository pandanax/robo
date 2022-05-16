import {Query, Resolver} from '@nestjs/graphql';
import {BinanceService} from './binance.service';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../auth/gql-jwt-auth.guard';
import {CurrentUser} from '../auth/auth.decorator';
import {GqlExchangeInfo} from './types/getExchangeInfo.types';
import {mapSymbols} from './helpers/getExchangeInfo.helper';


@Resolver()
export class BinanceResolver {
    constructor(private binanceService: BinanceService) {
    }

    @Query(() => GqlExchangeInfo)
    @UseGuards(GqlAuthGuard)
    getExchangeInfo(@CurrentUser() user: { userId: string }) {
        return this.binanceService.getExchangeInfo().then(mapSymbols);
    }
}


