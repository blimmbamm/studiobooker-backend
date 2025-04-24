import { IsEmail, IsNumber, IsString } from 'class-validator';

export class PersonnelDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  // Should relations also be added here?
}
