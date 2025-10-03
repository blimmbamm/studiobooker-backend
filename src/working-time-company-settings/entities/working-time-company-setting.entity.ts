import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/**
 * This is deliberately the same as working time, because both in the end contain the same data.
 *
 * Maybe this could extend the other working time entity?!
 */
@Entity({ orderBy: { id: 'ASC' } })
export class WorkingTimeCompanySetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weekday: string;

  @Column()
  start: string;

  @Column()
  end: string;

  // If weekday should be visible at all (e.g. not sunday) -> company setting
  @Column()
  activated: boolean;

  @ManyToOne(() => Company, (company) => company.workingTimeSettings)
  @Exclude()
  company?: Company;
}
