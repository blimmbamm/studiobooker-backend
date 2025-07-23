import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from 'src/company/entities/company.entity';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';

@UseGuards(AuthGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  findMany(
    @UseCompany() company: Company,
    @Query() appointmentQueryDto: AppointmentQueryDto,
  ) {
    return this.appointmentService.findMany(company, appointmentQueryDto);
  }

  @Post('seed')
  seedAppointments(@UseCompany() company: Company) {
    return this.appointmentService.seedAppointments(company);
  }

  @HttpCode(HttpStatus.OK)
  @Post('available-slots')
  findAvailableSlots(
    @UseCompany() company: Company, // this should not need company later,
    @Body() availableSlotsQueryDto: AvailableSlotsQueryDto,
  ) {
    return this.appointmentService.findAvailableSlots(
      company,
      availableSlotsQueryDto,
    );
  }
}
