import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CustomError } from '../errors/custom.error';
import {
  CreateLocationDto,
  DeleteLocationDto,
  UpdateLocationDto,
} from './location.dto';

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
    return this.prisma.$transaction([
      this.prisma.telemetry.count({
        where: {
          station_name: name,
        },
      }),
      this.prisma.station.findFirst({
        where: {
          name,
        },
        select: {
          title: true,
          status: true,
          telemetry: {
            orderBy: {
              created_at: 'desc',
            },
            take: 200,
          },
        },
      }),
    ]);
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

  async update(data: UpdateLocationDto) {
    const id = data.id;
    const check = await this.prisma.station.count({
      where: {
        id,
      },
    });

    if (check < 1) {
      throw new CustomError(404, 'station not found');
    }

    delete data.id;

    await this.prisma.station.updateMany({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }
}
