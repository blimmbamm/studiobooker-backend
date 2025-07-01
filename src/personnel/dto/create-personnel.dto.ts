import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreatePersonnelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((o) => o.email !== null)
  @IsOptional()
  @IsEmail()
  email: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsString()
  phone: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsBoolean()
  activated: boolean;
}
