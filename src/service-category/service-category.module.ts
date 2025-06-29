import { forwardRef, Module } from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { ServiceCategoryController } from './service-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { CompanyModule } from 'src/company/company.module';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceCategory]),
    CompanyModule,
    forwardRef(() => ServiceModule),
  ],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService],
  exports: [ServiceCategoryService],
})
export class ServiceCategoryModule {}
