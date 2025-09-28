import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { PersonnelModule } from 'src/personnel/personnel.module';
import { ServiceModule } from 'src/service/service.module';
import { EmailModule } from '../email/email.module';
import { CompanyInfoModule } from '../company-info/company-info.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    CompanyModule,
    CompanyInfoModule,
    PersonnelModule,
    ServiceModule,
    EmailModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
