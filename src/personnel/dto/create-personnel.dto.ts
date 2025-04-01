import { Service } from "src/service/entities/service.entity";

export class CreatePersonnelDto {
  name: string;
  services?: Service[];
}
