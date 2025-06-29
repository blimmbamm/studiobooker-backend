import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateServiceInCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
