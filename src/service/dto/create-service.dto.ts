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

  @IsOptional()
  @IsPositive()
  duration?: number;

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
