import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkingTimeCompanySetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weekday: string;

  @Column()
  defaultStart: string;

  @Column()
  defaultEnd: string;

  // If weekday should be visible at all (e.g. not sunday) -> company setting
  @Column()
  enabled: boolean;

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;
}
