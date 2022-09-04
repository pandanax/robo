export const MAP_SYMBOLS = {
    'm': 'hour',
    'h': 'day',
    'd': 'month',
    'w': 'year',
    'M': 'year',
}
export const makeSymbolIntervalFormIndex = index => index.split('_').reduce((acc, val, i) => {
    if (i === 0) {
        acc.symbol = val;
    } else {
        acc.interval = val;
    }
    return acc;
}, {symbol: undefined, interval: undefined});
export const makeSymbolTickerIndex = ({symbol, interval}) => `${symbol}_${interval}`;
export const makeCandleId = ({symbol, interval, openTime}) => `${symbol}_${interval}_${openTime}`;
