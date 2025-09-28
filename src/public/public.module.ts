import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';
import { ServiceCategoryModule } from '../service-category/service-category.module';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { AppointmentModule } from '../appointment/appointment.module';
import { PersonnelModule } from '../personnel/personnel.module';

@Module({
  imports: [
    CompanyModule,
    ServiceCategoryModule,
    PersonnelModule,
    AppointmentModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
