import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => (value === 0 ? null : value))
  @IsOptional()
  @IsPositive()
  duration?: number;

  @Transform(({ value }) => (value === 0 ? null : value))
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsBoolean()
  activated?: boolean;

  @IsPositive()
  @IsNumber()
  serviceCategoryId: number;
}
