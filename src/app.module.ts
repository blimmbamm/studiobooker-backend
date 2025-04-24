import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Company } from './company/entities/company.entity';
import { PersonnelModule } from './personnel/personnel.module';
import { Personnel } from './personnel/entities/personnel.entity';
import { ServiceModule } from './service/service.module';
import { Service } from './service/entities/service.entity';
import { CompanyInfoModule } from './company-info/company-info.module';
import { CompanyInfo } from './company-info/entities/company-info.entity';
import { WorkingTimeModule } from './working-time/working-time.module';
import { WorkingTime } from './working-time/entities/working-time.entity';

const typeorm_config: SqliteConnectionOptions = {
  database: 'db',
  type: 'sqlite',
  synchronize: true,
  entities: [Company, Personnel, Service, CompanyInfo, WorkingTime]
};

@Module({
  imports: [
    TypeOrmModule.forRoot(typeorm_config),
    AuthModule,
    CompanyModule,
    PersonnelModule,
    ServiceModule,
    CompanyInfoModule,
    WorkingTimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
