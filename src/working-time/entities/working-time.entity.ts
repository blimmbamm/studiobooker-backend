import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkingTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weekday: string;

  @Column()
  start: string; // store HH:mm

  @Column()
  end: string;

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;

  @ManyToOne(() => Personnel, (personnel) => personnel.workingTimes)
  personnel?: Personnel;
}
