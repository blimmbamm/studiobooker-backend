import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { WorkingTimeCompanySetting } from 'src/working-time-company-settings/entities/working-time-company-setting.entity';
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

  // If weekday is activated for personnel
  @Column()
  activated: boolean;

  @ManyToOne(() => WorkingTimeCompanySetting)
  workingTimeCompanySetting?: WorkingTimeCompanySetting;

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;

  @ManyToOne(() => Personnel, (personnel) => personnel.workingTimes, {
    onDelete: 'CASCADE',
  })
  personnel?: Personnel;
}
