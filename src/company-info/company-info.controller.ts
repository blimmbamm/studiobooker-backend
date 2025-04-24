import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyInfoService } from './company-info.service';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';

@Controller('company-info')
export class CompanyInfoController {
  constructor(private readonly companyInfoService: CompanyInfoService) {}

  @Post()
  create(@Body() createCompanyInfoDto: CreateCompanyInfoDto) {
    return this.companyInfoService.create(createCompanyInfoDto);
  }

  @Get()
  findAll() {
    return this.companyInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyInfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyInfoDto: UpdateCompanyInfoDto) {
    return this.companyInfoService.update(+id, updateCompanyInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyInfoService.remove(+id);
  }
}
