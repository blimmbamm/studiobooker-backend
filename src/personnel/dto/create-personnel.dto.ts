import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ServiceDto } from 'src/service/dto/service.dto';

export class CreatePersonnelDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ServiceDto)
  services?: ServiceDto[];
}
