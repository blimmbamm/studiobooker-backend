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

@Entity({ orderBy: { id: 'ASC' } })
export class Personnel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // TODO: This should not be unique... at most this should be unique within the company
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ default: false })
  activated: boolean;

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;

  @ManyToMany(() => Service, (service) => service.personnel, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  services?: Service[];

  @OneToMany(() => WorkingTime, (workingTime) => workingTime.personnel, {
    cascade: true,
  })
  workingTimes?: WorkingTime[];
}
