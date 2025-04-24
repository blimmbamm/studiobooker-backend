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
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from 'src/company/entities/company.entity';
import { AddWorkingTimeToPersonnelDto } from './dto/add-working-time-to-personnel.dto';
import { UpdateWorkingTimeForPersonnelDto } from './dto/update-working-time-for-personnel.dto';

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
  findOne(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.personnelService.findOne(+id, company);
  }

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
  ) {
    return this.personnelService.update(+id, company, updatePersonnelDto);
  }

  @Delete(':id')
  remove(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.personnelService.remove(+id, company);
  }

  @Post(':id/working-time')
  addWorkingTime(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body() dto: AddWorkingTimeToPersonnelDto,
  ) {
    return this.personnelService.addWorkingTime(+id, company, dto.weekday);
  }

  @Patch(':id/working-time/:weekday')
  updateWorkingTime(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Param('weekday') weekday: string,
    @Body() dto: UpdateWorkingTimeForPersonnelDto,
  ) {
    return this.personnelService.updateWorkingTime(company, +id, weekday, dto)
  }
}
