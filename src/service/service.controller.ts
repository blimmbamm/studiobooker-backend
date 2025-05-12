import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from 'src/company/entities/company.entity';

@UseGuards(AuthGuard)
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(
    @UseCompany() company: Company,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.serviceService.create(company, createServiceDto);
  }

  @Get()
  findAll(@UseCompany() company: Company) {
    return this.serviceService.findAll(company);
  }

  @Get(':id')
  findOne(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.serviceService.findOneStructured(+id, company);
  }

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(+id, company, updateServiceDto);
  }

  @Delete(':id')
  remove(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.serviceService.remove(+id, company);
  }

  @Post(':id/personnel/:personnelId')
  addPersonnelToService(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Param('personnelId', ParseIntPipe) personnelId: string,
  ) {
    // Find service with id
    // check if personnelId is already in array of personnel
    // Insert if not
    return this.serviceService.addPersonnelToService(
      company,
      +id,
      +personnelId,
    );
  }

  @Delete(':id/personnel/:personnelId')
  removePersonnelFromService(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Param('personnelId', ParseIntPipe) personnelId: string,
  ) {
    return this.serviceService.removePersonnelFromService(
      company,
      +id,
      +personnelId,
    );
  }
}
