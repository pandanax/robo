import { Test, TestingModule } from '@nestjs/testing';
import { BinanceResolver } from './binance.resolver';

describe('BinanceResolver', () => {
  let resolver: BinanceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceResolver],
    }).compile();

    resolver = module.get<BinanceResolver>(BinanceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
