import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Service } from 'src/service/entities/service.entity';
import { WorkingTime } from 'src/working-time/entities/working-time.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Personnel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  email: string;

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;

  @ManyToMany(() => Service, (service) => service.personnel)
  @JoinTable()
  services?: Service[];

  @OneToMany(() => WorkingTime, (workingTime) => workingTime.personnel)
  workingTimes?: WorkingTime[];
}
