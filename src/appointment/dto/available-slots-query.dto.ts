import { Transform } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';
import * as dayjs from 'dayjs';

export class AvailableSlotsQueryDto {
  @Transform(({ value }) => {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.toDate() : null;
  })
  @IsDate()
  start: Date;

  @IsNumber()
  serviceId: number;

  @IsNumber()
  staffId: number;
}
