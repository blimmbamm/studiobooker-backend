import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyInfoDto } from './create-company-info.dto';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCompanyInfoDto {
  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsString()
  name?: string | null;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsString()
  description?: string | null;
}
