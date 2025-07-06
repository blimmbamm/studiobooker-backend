import { forwardRef, Module } from '@nestjs/common';
import { WorkingTimeCompanySettingsService } from './working-time-company-settings.service';
import { WorkingTimeCompanySettingsController } from './working-time-company-settings.controller';
import { WorkingTimeCompanySetting } from './entities/working-time-company-setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkingTimeCompanySetting]),
    forwardRef(() => CompanyModule),
  ],
  controllers: [WorkingTimeCompanySettingsController],
  providers: [WorkingTimeCompanySettingsService],
  exports: [WorkingTimeCompanySettingsService],
})
export class WorkingTimeCompanySettingsModule {}
