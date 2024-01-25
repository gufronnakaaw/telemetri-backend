import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
        instrument: {
          select: {
            data: true,
          },
        },
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
          instrument: {
            select: {
              data: true,
            },
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

    const { instrument, ...create } = data;

    instrument as Prisma.JsonArray;

    await this.prisma.station.create({
      data: {
        ...create,
        instrument: {
          create: {
            data: instrument,
          },
        },
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
      this.prisma.instrument.deleteMany({
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
    const check = await this.prisma.station.findFirst({
      where: {
        id,
      },
      select: {
        name: true,
      },
    });

    if (!check) {
      throw new CustomError(404, 'station not found');
    }

    delete data.id;
    const { instrument, ...all } = data;

    instrument as Prisma.JsonArray;

    await this.prisma.station.update({
      where: {
        id,
      },
      data: {
        ...all,
        instrument: {
          updateMany: {
            where: {
              station_name: check.name,
            },
            data: {
              data: instrument,
            },
          },
        },
      },
    });
  }
}
