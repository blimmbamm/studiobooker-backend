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
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import {
  CreateServiceCategoryDto,
  CreateServiceInCategoryDto,
} from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from 'src/company/entities/company.entity';
import { OptionalParseBoolPipe } from '../common/pipes/optional-parse-bool.pipe';

@UseGuards(AuthGuard)
@Controller('service-category')
export class ServiceCategoryController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  @Post()
  create(
    @UseCompany() company: Company,
    @Body() createServiceCategoryDto: CreateServiceCategoryDto,
  ) {
    return this.serviceCategoryService.create(
      company,
      createServiceCategoryDto,
    );
  }

  @Post(':id/service')
  createServiceInCategory(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body() dto: CreateServiceInCategoryDto,
  ) {
    return this.serviceCategoryService.createServiceInCategory(
      company,
      +id,
      dto,
    );
  }

  @Get()
  findAll(
    @UseCompany() company: Company,
    @Query('activated', OptionalParseBoolPipe) activated?: boolean,
  ) {
    console.log(activated);
    return this.serviceCategoryService.findAll(company, {
      services: { activated },
    });
  }

  @Get(':id')
  findOne(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.serviceCategoryService.findOne(company, +id);
  }

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id') id: string,
    @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
  ) {
    return this.serviceCategoryService.update(
      company,
      +id,
      updateServiceCategoryDto,
    );
  }

  @Delete(':id')
  remove(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.serviceCategoryService.remove(company, +id);
  }
}
