import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Service } from 'src/service/entities/service.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ServiceCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Service, (service) => service.serviceCategory)
  services?: Service[];

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;
}
