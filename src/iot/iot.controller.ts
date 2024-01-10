import { Body, Controller, Post } from '@nestjs/common';
import { CustomException } from 'src/errors/custom.exception';
import { CreateTelemetryDto } from './iot.dto';
import { IotService } from './iot.service';

@Controller('iot')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Post()
  async create(@Body() body: CreateTelemetryDto) {
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
}
