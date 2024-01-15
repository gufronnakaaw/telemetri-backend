import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CustomError } from 'src/errors/custom.error';
import { CreateLocationDto, DeleteLocationDto } from './location.dto';

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

  getDetail(name: string) {
    return this.prisma.telemetry.findMany({
      where: {
        station_name: name,
      },
    });
  }

  async create(data: CreateLocationDto) {
    const check = await this.prisma.station.count({
      where: {
        name: data.name,
      },
    });

    if (check > 0) {
      throw new CustomError(400, 'name already exists');
    }

    await this.prisma.station.create({
      data: {
        ...data,
      },
    });
  }

  async remove(data: DeleteLocationDto) {
    const check = await this.prisma.station.count({
      where: {
        name: data.name,
      },
    });

    if (check < 1) {
      throw new CustomError(404, 'name not found');
    }

    await this.prisma.$transaction([
      this.prisma.telemetry.deleteMany({
        where: {
          station_name: data.name,
        },
      }),
      this.prisma.station.deleteMany({
        where: {
          name: data.name,
        },
      }),
    ]);
  }
}
