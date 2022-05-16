import {Test, TestingModule} from '@nestjs/testing';
import {BinanceService} from '../binance.service';

jest.mock('binance', () => ({
    MainClient: function () {
        return {
            getExchangeInfo: () => Promise.resolve({
                timezone: 'string',
                serverTime: 1,
                rateLimits: [],
                exchangeFilters: [],
                symbols: [],
            })
        }
    }
}))
describe('BinanceService', () => {
    let service: BinanceService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [BinanceService],
        }).compile();

        service = module.get<BinanceService>(BinanceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
