import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import * as dayjs from 'dayjs'; // has to stay like this
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export class AppointmentQueryDto {
  @Transform(({ value }) => {
    const parsed = dayjs(value, 'YYYYMMDD', true); // strict mode
    return parsed.isValid() ? value : null;
  })
  @IsNotEmpty()
  @IsString()
  from: string;

  @Transform(({ value }) => {
    const parsed = dayjs(value, 'YYYYMMDD', true); // strict mode
    return parsed.isValid() ? value : null;
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @Transform(({ value }) => {
    const values = typeof value === 'string' ? value.split(',') : value;
    return values.map((v: string) => parseInt(v, 10)).filter(Number.isFinite);
  })
  @IsArray()
  staff: number[];

  @IsOptional()
  @IsBoolean()
  includeCancelledAppointments?: boolean;
}
