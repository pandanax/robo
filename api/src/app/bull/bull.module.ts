import { Module } from '@nestjs/common';
import { BullModule as QueueModule } from '@nestjs/bull';

@Module({
    imports: [
        QueueModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
    ],
})
export class BullModule {}
