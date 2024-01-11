import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CustomException } from 'src/errors/custom.exception';
import { CreateTelemetryDto } from './iot.dto';
import { IotService } from './iot.service';

@Controller('iot')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Post()
  async createViaPost(@Body() body: CreateTelemetryDto) {
    try {
      await this.iotService.create(body);

      return {
        success: true,
        message: 'the data has been created',
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @Get()
  async createViaGet(@Query() query: CreateTelemetryDto) {
    try {
      await this.iotService.create(query);

      return {
        success: true,
        message: 'the data has been created',
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
