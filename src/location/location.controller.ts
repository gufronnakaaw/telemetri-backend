import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomException } from '../errors/custom.exception';
import {
  CreateLocationDto,
  DeleteLocationDto,
  UpdateLocationDto,
} from './location.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('maps')
  async getMaps() {
    try {
      const data = await this.locationService.getMaps();

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @Get('detail/:name')
  async detailStation(
    @Param('name') name: string,
    @Query('period') period: string,
  ) {
    try {
      const [total_data, data] = await this.locationService.getDetail(
        name,
        period,
      );

      const { instrument, ...all } = data;

      return {
        success: true,
        data: {
          total_data,
          ...all,
          instrument: instrument[0].data,
        },
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @Post()
  async create(@Body() body: CreateLocationDto) {
    try {
      await this.locationService.create(body);

      return {
        success: true,
        message: 'the location has been created',
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @Delete()
  async remove(@Body() body: DeleteLocationDto) {
    try {
      await this.locationService.remove(body);

      return {
        success: true,
        message: 'the location has been deleted',
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @Patch()
  async update(@Body() body: UpdateLocationDto) {
    try {
      await this.locationService.update(body);

      return {
        success: true,
        message: 'the location has been updated',
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
