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

@Entity({ orderBy: { id: 'ASC' } })
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

  @Column({ default: false })
  activated: boolean;

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;

  @Exclude()
  @ManyToMany(() => Personnel, (personnel) => personnel.services, {
    onDelete: 'CASCADE',
  })
  personnel?: Personnel[];

  @ManyToOne(
    () => ServiceCategory,
    (serviceCategory) => serviceCategory.services,
    { onDelete: 'CASCADE' },
  )
  serviceCategory?: ServiceCategory;
}
