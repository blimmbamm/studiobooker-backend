import { forwardRef, Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { CompanyModule } from 'src/company/company.module';
import { PersonnelModule } from 'src/personnel/personnel.module';
import { ServiceCategoryModule } from 'src/service-category/service-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    CompanyModule,
    forwardRef(() => PersonnelModule),
    ServiceCategoryModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
