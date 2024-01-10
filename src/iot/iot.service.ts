import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTelemetryDto } from './iot.dto';

@Injectable()
export class IotService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTelemetryDto) {
    await this.prisma.$transaction([
      this.prisma.telemetry.create({
        data: {
          ...data,
        },
      }),
    ]);
  }
}
