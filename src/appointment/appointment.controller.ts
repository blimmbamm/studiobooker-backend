import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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

  @Post()
  createAppointment(
    @UseCompany() company: Company,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.createAppointment(
      company,
      createAppointmentDto,
    );
  }

  @Patch(':id')
  updateAppointment(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(company, +id, dto);
  }

  @Patch('cancel/:id')
  cancelAppointment(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.appointmentService.cancelAppointment(company, +id);
  }
}
