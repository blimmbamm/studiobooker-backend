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
    return this.serviceService.findOneStructured(company, +id);
  }

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(company, +id, updateServiceDto);
  }

  @Patch(':id/category/:categoryId')
  updateCategory(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Param('categoryId', ParseIntPipe) categoryId: string,
  ) {
    return this.serviceService.updateCategoryForService(
      company,
      +id,
      +categoryId,
    );
  }

  @Delete(':id')
  remove(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.serviceService.remove(company, +id);
  }

  @Post(':id/personnel/:personnelId')
  addPersonnelToService(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Param('personnelId', ParseIntPipe) personnelId: string,
  ) {
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
