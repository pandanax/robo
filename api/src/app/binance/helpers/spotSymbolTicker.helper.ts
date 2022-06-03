import {SpotSymbolTicker} from '../types/spotSymbolTicker.types';
import {SpotOrder} from 'binance';
import {ExtendedSpotOrder} from '../types/getKlines.types';

export const makeSpotSymbolTickerIndex = (
    {
        wsMarket,
        eventType,
        symbol,
        eventTime,
    }: SpotSymbolTicker | ExtendedSpotOrder) => `${wsMarket}_${eventType}_${symbol}_${eventTime}`.toLowerCase()

export const makeSpotSymbolTickerGlobalIndex = (
    {
        wsMarket,
        eventType,
        symbol,
    }: SpotSymbolTicker | ExtendedSpotOrder) => `${wsMarket}_${eventType}_${symbol}`.toLowerCase()

export const makeSymbolTickerIndex = ({symbol, interval}) => `${symbol}_${interval}`.toLowerCase();
