import { Personnel } from 'src/personnel/entities/personnel.entity';

export class CreateServiceDto {
  description: string;
  personnel?: Personnel[];
}
