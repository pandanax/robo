import {Injectable} from '@nestjs/common';
import {ExchangeInfo, MainClient} from 'binance';

const API_KEY = '3iiYaWO7SA4iGLkQTWbpFfhJ9riJlXEF9yulMO3qt8pq5HFwOitNtdHbyWJ3CFPn';
const API_SECRET = 'JExC73w94q3Kg3D9vsJpe3kWmnwo76XzkrxAoQyMuFnWGClicnkBNXnTc2WEnsZx';

const client = new MainClient({
    api_key: API_KEY,
    api_secret: API_SECRET,
});

@Injectable()
export class BinanceService {

    getExchangeInfo(): Promise<void | ExchangeInfo> {
        return client.getExchangeInfo()
    }

}
