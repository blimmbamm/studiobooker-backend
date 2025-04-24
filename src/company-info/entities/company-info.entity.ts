import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CompanyInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: true })
  name: string | null;

  @Column({ type: String, nullable: true })
  description: string | null;

  @OneToOne(() => Company, (company) => company.companyInfo)
  company: Company;
}
