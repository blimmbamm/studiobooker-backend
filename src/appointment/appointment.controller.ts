import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from 'src/company/entities/company.entity';
import { AppointmentQueryDto } from './dto/appointment-query.dto';

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
}
