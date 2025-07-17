import { Transform } from 'class-transformer';
import { IsArray, IsDate } from 'class-validator';
import * as dayjs from 'dayjs'; // has to stay like this
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export class AppointmentQueryDto {
  @Transform(({ value }) => {
    const parsed = dayjs.utc(value, 'YYYYMMDD', true); // strict mode
    return parsed.isValid() ? parsed.toDate() : null;
  })
  @IsDate()
  from: Date;

  @Transform(({ value }) => {
    const parsed = dayjs.utc(value, 'YYYYMMDD', true);
    return parsed.isValid() ? parsed.endOf('day').toDate() : null;
  })
  @IsDate()
  to: Date;

  @Transform(({ value }) => {
    const values = typeof value === 'string' ? value.split(',') : value;
    return values.map((v: string) => parseInt(v, 10)).filter(Number.isFinite);
  })
  @IsArray()
  staff: number[];
}
