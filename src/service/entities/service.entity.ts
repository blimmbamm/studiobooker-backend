import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { ServiceCategory } from 'src/service-category/entities/service-category.entity';
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

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  price: number;

  @Column({default: false})
  activated: boolean;

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;

  @ManyToMany(() => Personnel, (personnel) => personnel.services)
  personnel?: Personnel[];

  @ManyToOne(
    () => ServiceCategory,
    (serviceCategory) => serviceCategory.services,
  )
  serviceCategory?: ServiceCategory;
}
