import { forwardRef, Module } from '@nestjs/common';
import { CompanyInfoService } from './company-info.service';
import { CompanyInfoController } from './company-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyInfo } from './entities/company-info.entity';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyInfo]),
    forwardRef(() => CompanyModule),
  ],
  controllers: [CompanyInfoController],
  providers: [CompanyInfoService],
  exports: [CompanyInfoService],
})
export class CompanyInfoModule {}
