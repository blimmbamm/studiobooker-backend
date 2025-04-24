import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PersonnelDto } from 'src/personnel/dto/personnel.dto';

export class ServiceDto {
  @IsNumber()
  id: number;

  @IsString()
  description: string;

  // Should relations also be added here?
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonnelDto)
  personnel?: PersonnelDto[];
}
