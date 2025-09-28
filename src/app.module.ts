import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Company } from './company/entities/company.entity';
import { PersonnelModule } from './personnel/personnel.module';
import { Personnel } from './personnel/entities/personnel.entity';
import { ServiceModule } from './service/service.module';
import { Service } from './service/entities/service.entity';
import { CompanyInfo } from './company-info/entities/company-info.entity';
import { WorkingTimeModule } from './working-time/working-time.module';
import { WorkingTime } from './working-time/entities/working-time.entity';
import { ServiceCategoryModule } from './service-category/service-category.module';
import { ServiceCategory } from './service-category/entities/service-category.entity';
import { WorkingTimeCompanySettingsModule } from './working-time-company-settings/working-time-company-settings.module';
import { WorkingTimeCompanySetting } from './working-time-company-settings/entities/working-time-company-setting.entity';
import { AppointmentModule } from './appointment/appointment.module';
import { Appointment } from './appointment/entities/appointment.entity';
import { PublicModule } from './public/public.module';

const typeorm_config: SqliteConnectionOptions = {
  database: 'db',
  type: 'sqlite',
  synchronize: true,
  entities: [
    Company,
    Personnel,
    Service,
    ServiceCategory,
    CompanyInfo,
    WorkingTime,
    WorkingTimeCompanySetting,
    Appointment,
  ],
};

@Module({
  imports: [
    TypeOrmModule.forRoot(typeorm_config),
    AuthModule,
    PersonnelModule,
    ServiceCategoryModule,
    ServiceModule,
    WorkingTimeModule,
    WorkingTimeCompanySettingsModule,
    AppointmentModule,
    PublicModule,
  ],
})
export class AppModule {}
