import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Personnel } from 'src/personnel/entities/personnel.entity';

export class CreateServiceDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @Type(() => Personnel)
  personnel?: Personnel[];
}
