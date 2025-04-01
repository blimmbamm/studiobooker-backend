import { Company } from "src/company/entities/company.entity";
import { Service } from "src/service/entities/service.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Personnel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Company)
  company: Company

  @ManyToMany(() => Service, (service) => service.personnel)
  @JoinTable()
  services: Service[]
}
