import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
  findOne(@UseCompany() company: Company, @Param('id') id: string) {
    return this.serviceService.findOne(+id, company);
  }

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(+id, company, updateServiceDto);
  }

  @Delete(':id')
  remove(@UseCompany() company: Company, @Param('id') id: string) {
    return this.serviceService.remove(+id, company);
  }
}
