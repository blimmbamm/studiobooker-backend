import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyInfoModule } from 'src/company-info/company-info.module';
import { WorkingTimeCompanySettingsModule } from 'src/working-time-company-settings/working-time-company-settings.module';
import { CompanyController } from './company.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    CompanyInfoModule,
    WorkingTimeCompanySettingsModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
