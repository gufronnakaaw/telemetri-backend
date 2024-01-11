import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CustomError } from 'src/errors/custom.error';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  getMaps() {
    return this.prisma.station.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        status: true,
        lat: true,
        long: true,
      },
    });
  }

  async getDetail(name: string) {
    const check = await this.prisma.telemetry.count({
      where: {
        station_name: name,
      },
    });

    if (check < 1) {
      throw new CustomError(404, 'name not found');
    }

    return this.prisma.telemetry.findMany({
      where: {
        station_name: name,
      },
    });
  }
}
