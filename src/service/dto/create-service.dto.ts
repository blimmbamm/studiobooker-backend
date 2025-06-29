import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

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

  @IsPositive()
  @IsNumber()
  serviceCategoryId: number;
}
