import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LocationController } from './location.controller';
import { LocationMiddleware } from './location.middleware';
import { LocationService } from './location.service';

@Module({
  controllers: [LocationController],
  providers: [LocationService, PrismaService],
})
export class LocationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocationMiddleware).forRoutes('location');
  }
}
