import {Query, Resolver, Subscription} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {PubSub} from 'graphql-subscriptions';
import {BinanceService} from './binance.service';
import {GqlAuthGuard} from '../auth/gql-jwt-auth.guard';
import {CurrentUser} from '../auth/auth.decorator';
import {binanceWsClient} from './binance.ws.client';
import {GqlExchangeInfo, SpotSymbolTicker} from './binance.outputs';

const pubSub = new PubSub();

@Resolver()
export class BinanceResolver {
    constructor(
        private binanceService: BinanceService,
    ) {}

    @Query(() => GqlExchangeInfo)
    @UseGuards(GqlAuthGuard)
    getExchangeInfo(@CurrentUser() user: { userId: string }) {
        return this.binanceService.getExchangeInfo().then(this.binanceService.mapSymbols);
    }

    @Subscription(() => SpotSymbolTicker, {
        name: 'subscribeSpotSymbol24hrTicker',
    })
    subscribeSpotSymbol24hrTicker() {
        binanceWsClient.subscribeSpotSymbol24hrTicker('BTCUSDT');
        binanceWsClient.on('open', (data) => {
            console.log('connection opened open:', data.wsKey, data.ws.target.url);
        });
        binanceWsClient.on('formattedMessage', async (
            data: SpotSymbolTicker) => {
            return pubSub.publish('subscribeSpotSymbol24hrTicker', {'subscribeSpotSymbol24hrTicker': data});
        });
        return pubSub.asyncIterator('subscribeSpotSymbol24hrTicker');
    }

}
