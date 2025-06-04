import { Module } from '@nestjs/common';
import { WorkingTimeCompanySettingsService } from './working-time-company-settings.service';
import { WorkingTimeCompanySettingsController } from './working-time-company-settings.controller';
import { WorkingTimeCompanySetting } from './entities/working-time-company-setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingTimeCompanySetting])],
  controllers: [WorkingTimeCompanySettingsController],
  providers: [WorkingTimeCompanySettingsService],
  exports: [WorkingTimeCompanySettingsService],
})
export class WorkingTimeCompanySettingsModule {}
