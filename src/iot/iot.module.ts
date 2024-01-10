import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IotController } from './iot.controller';
import { IotMiddleware } from './iot.middleware';
import { IotService } from './iot.service';

@Module({
  controllers: [IotController],
  providers: [IotService, PrismaService],
})
export class IotModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IotMiddleware).forRoutes('iot');
  }
}
