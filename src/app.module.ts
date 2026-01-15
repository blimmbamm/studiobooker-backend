import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      envFilePath: '.env.production',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          synchronize: true,
          extra: isProd ? { ssl: { rejectUnauthorized: false } } : undefined,
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
      },
    }),
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
