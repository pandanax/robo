export const MAP_SYMBOLS = {
    'm': 'hour',
    'h': 'day',
    'd': 'month',
    'M': 'year',
}
export const makeSymbolTickerIndex = ({symbol, interval}) => `${symbol}_${interval}`.toLowerCase();
export const makeCandleId = ({symbol, interval, openTime}) => `${symbol}_${interval}_${openTime}`.toLowerCase();
