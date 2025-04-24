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
import { WorkingTimeService } from './working-time.service';
import { CreateWorkingTimeDto } from './dto/create-working-time.dto';
import { UpdateWorkingTimeDto } from './dto/update-working-time.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from 'src/company/entities/company.entity';

@UseGuards(AuthGuard)
@Controller('working-time')
export class WorkingTimeController {
  constructor(private readonly workingTimeService: WorkingTimeService) {}

  // @Post()
  // create(@Body() createWorkingTimeDto: CreateWorkingTimeDto) {
  //   return this.workingTimeService.create(createWorkingTimeDto);
  // }

  // @Get()
  // findAll() {
  //   return this.workingTimeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.workingTimeService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateWorkingTimeDto: UpdateWorkingTimeDto,
  ) {
    return this.workingTimeService.update(company, +id, updateWorkingTimeDto);
  }

  @Delete(':id')
  remove(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.workingTimeService.remove(company, +id);
  }
}
