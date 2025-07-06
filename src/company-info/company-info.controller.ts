import {
  Controller,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CompanyInfoService } from './company-info.service';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from 'src/company/entities/company.entity';

@UseGuards(AuthGuard)
@Controller('company-info')
export class CompanyInfoController {
  constructor(private readonly companyInfoService: CompanyInfoService) {}

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCompanyInfoDto: UpdateCompanyInfoDto,
  ) {
    return this.companyInfoService.update(company, +id, updateCompanyInfoDto);
  }
}
