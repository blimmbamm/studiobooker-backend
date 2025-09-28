import { Module } from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { PersonnelController } from './personnel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personnel } from './entities/personnel.entity';
import { CompanyModule } from 'src/company/company.module';
import { WorkingTimeModule } from 'src/working-time/working-time.module';
import { ServiceCategoryModule } from 'src/service-category/service-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Personnel]),
    CompanyModule,
    ServiceCategoryModule,
    WorkingTimeModule,
  ],
  controllers: [PersonnelController],
  providers: [PersonnelService],
  exports: [PersonnelService],
})
export class PersonnelModule {}
