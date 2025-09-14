import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PublicService } from './public.service';
import {
  AvailableSlotsQueryDto,
  AvailableSlotsQueryWithCompanyDto,
} from '../appointment/dto/available-slots-query.dto';
import { CreateAppointmentWithCompanyDto } from '../appointment/dto/create-appointment.dto';

@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('studio/:id')
  getStudio(@Param('id') id: string) {
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new NotFoundException();
    }

    return this.publicService.findStudioStructured(parsedId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('service-personnel')
  getPersonnelByService(
    // TODO: check if this needs any validation
    @Body() body: { companyId: number; serviceId: number },
  ) {
    return this.publicService.findPersonnelByService(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('available-appointment-slots')
  getAvailableAppointmentSlots(
    @Body() body: AvailableSlotsQueryWithCompanyDto,
  ) {
    return this.publicService.findAvailableAppointmentSlots(body);
  }

  @Post('appointment')
  createAppointment(@Body() body: CreateAppointmentWithCompanyDto) {
    return this.publicService.createAppointment(body);
  }
}
