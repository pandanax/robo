import {ExchangeInfo} from 'binance';

export const mapSymbols = (r: ExchangeInfo) => ({
    ...r,
    symbols: r.symbols.map(s => ({
        ...s,
        filters: JSON.stringify(s.filters)
    }))
})

