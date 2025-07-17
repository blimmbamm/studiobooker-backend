import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { CompanyModule } from 'src/company/company.module';
import { PersonnelModule } from 'src/personnel/personnel.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    CompanyModule,
    PersonnelModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
