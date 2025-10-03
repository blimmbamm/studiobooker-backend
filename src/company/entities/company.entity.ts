import { Exclude } from 'class-transformer';
import { CompanyInfo } from 'src/company-info/entities/company-info.entity';
import { WorkingTimeCompanySetting } from 'src/working-time-company-settings/entities/working-time-company-setting.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ orderBy: { id: 'ASC' } })
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // What happens if i remove this?
  @Column({ type: String, nullable: true })
  name: string | null;

  @Exclude()
  @Column()
  hashedPassword: string;

  @Exclude()
  @Column({ type: String, nullable: true })
  hashedVerificationToken: string | null;

  @Exclude()
  @Column({ type: Date, nullable: true })
  verificationTokenExpiresAt: Date | null;

  @Exclude()
  @Column()
  verified: boolean;

  @OneToOne(() => CompanyInfo, (companyInfo) => companyInfo.company, {
    cascade: true,
  })
  @JoinColumn()
  companyInfo?: CompanyInfo;

  @OneToMany(
    () => WorkingTimeCompanySetting,
    (workingTimeSetting) => workingTimeSetting.company,
    { cascade: true },
  )
  workingTimeSettings?: WorkingTimeCompanySetting[];
}
