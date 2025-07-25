import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateAppointmentDto {
  @Transform(({ value }) => {
    return new Date(value);
  })
  @IsDate()
  start: Date;

  @IsPositive()
  @IsNumber()
  duration: number;

  @IsBoolean()
  confirmed: boolean;

  @IsNotEmpty()
  @IsString()
  title: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((o) => o.notes !== null)
  @IsString()
  notes: string | null;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsNumber()
  serviceId: number;

  @IsNumber()
  staffId: number;
}
