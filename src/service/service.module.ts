import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Personnel]), CompanyModule],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
