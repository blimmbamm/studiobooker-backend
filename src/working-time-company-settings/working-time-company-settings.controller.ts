import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkingTimeCompanySettingsService } from './working-time-company-settings.service';
import { CreateWorkingTimeCompanySettingDto } from './dto/create-working-time-company-setting.dto';
import { UpdateWorkingTimeCompanySettingDto } from './dto/update-working-time-company-setting.dto';

@Controller('working-time-company-settings')
export class WorkingTimeCompanySettingsController {
  constructor(private readonly workingTimeCompanySettingsService: WorkingTimeCompanySettingsService) {}

  @Post()
  create(@Body() createWorkingTimeCompanySettingDto: CreateWorkingTimeCompanySettingDto) {
    return this.workingTimeCompanySettingsService.create(createWorkingTimeCompanySettingDto);
  }

  @Get()
  findAll() {
    return this.workingTimeCompanySettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workingTimeCompanySettingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkingTimeCompanySettingDto: UpdateWorkingTimeCompanySettingDto) {
    return this.workingTimeCompanySettingsService.update(+id, updateWorkingTimeCompanySettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workingTimeCompanySettingsService.remove(+id);
  }
}
