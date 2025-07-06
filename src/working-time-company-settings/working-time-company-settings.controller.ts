import {
  Controller,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { WorkingTimeCompanySettingsService } from './working-time-company-settings.service';
import { UpdateWorkingTimeCompanySettingDto } from './dto/update-working-time-company-setting.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Company } from 'src/company/entities/company.entity';
import { UseCompany } from 'src/auth/auth.decorator';

@UseGuards(AuthGuard)
@Controller('working-time-company-settings')
export class WorkingTimeCompanySettingsController {
  constructor(
    private readonly workingTimeCompanySettingsService: WorkingTimeCompanySettingsService,
  ) {}

  @Patch(':id')
  update(
    @UseCompany() company: Company,
    @Param('id', ParseIntPipe) id: string,
    @Body()
    updateWorkingTimeCompanySettingDto: UpdateWorkingTimeCompanySettingDto,
  ) {
    return this.workingTimeCompanySettingsService.update(
      company,
      +id,
      updateWorkingTimeCompanySettingDto,
    );
  }
}
