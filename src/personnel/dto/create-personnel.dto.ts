import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Service } from 'src/service/entities/service.entity';

export class CreatePersonnelDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @Type(() => Service)
  services?: Service[];
}
