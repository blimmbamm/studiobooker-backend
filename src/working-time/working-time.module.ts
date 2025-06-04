import { Module } from '@nestjs/common';
import { WorkingTimeService } from './working-time.service';
import { WorkingTimeController } from './working-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingTime } from './entities/working-time.entity';
import { CompanyModule } from 'src/company/company.module';
import { WorkingTimeCompanySettingsModule } from 'src/working-time-company-settings/working-time-company-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkingTime]),
    CompanyModule,
    WorkingTimeCompanySettingsModule,
  ],
  controllers: [WorkingTimeController],
  providers: [WorkingTimeService],
  exports: [WorkingTimeService],
})
export class WorkingTimeModule {}
