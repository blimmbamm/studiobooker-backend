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
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from 'src/company/entities/company.entity';

@UseGuards(AuthGuard)
@Controller('personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}

  @Post()
  create(
    @UseCompany() company: Company,
    @Body() createPersonnelDto: CreatePersonnelDto,
  ) {
    return this.personnelService.create(company, createPersonnelDto);
  }

  @Get()
  findAll(@UseCompany() company: Company) {
    return this.personnelService.findAll(company);
  }

  @Get(':id')
  findOne(@UseCompany() company: Company, @Param('id') id: string) {
    return this.personnelService.findOne(+id, company);
  }

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
  ) {
    return this.personnelService.update(+id, company, updatePersonnelDto);
  }

  @Delete(':id')
  remove(@UseCompany() company: Company, @Param('id') id: string) {
    return this.personnelService.remove(+id, company);
  }
}
