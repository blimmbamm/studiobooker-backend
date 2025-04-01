import { Company } from 'src/company/entities/company.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @ManyToOne(() => Company)
  company: Company;

  @ManyToMany(() => Personnel, (personnel => personnel.services))
  personnel: Personnel[]
}
