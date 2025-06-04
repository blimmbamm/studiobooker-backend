import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkingTimeCompanySettingDto } from './create-working-time-company-setting.dto';

export class UpdateWorkingTimeCompanySettingDto extends PartialType(CreateWorkingTimeCompanySettingDto) {}
