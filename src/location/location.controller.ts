import { Controller, Get, Param } from '@nestjs/common';
import { CustomException } from 'src/errors/custom.exception';
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
  async detailStation(@Param('name') name) {
    try {
      const data = await this.locationService.getDetail(name);

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
