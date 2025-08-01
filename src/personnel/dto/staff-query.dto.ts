import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class StaffQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  serviceId?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return -1;
  })
  @IsBoolean()
  activated?: boolean;
}
 