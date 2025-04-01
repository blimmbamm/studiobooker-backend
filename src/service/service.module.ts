import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Personnel])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
