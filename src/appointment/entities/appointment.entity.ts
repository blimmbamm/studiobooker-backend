import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { Service } from 'src/service/entities/service.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Date })
  start: Date;

  @Column()
  duration: number; // in minutes

  @Column({ default: false })
  confirmed: boolean;

  @Column({
    type: 'text',
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  /**
   * Short title of the appointment that could be
   * displayed in the calendar.
   */
  @Column()
  title: string;

  /**
   * Some arbitrary notes
   */
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  /**
   * As for service, may be null if not related to a booked service.
   *
   * Later, this will be a relation to some separate customer entity.
   */
  @Column({ type: 'text', nullable: true })
  customer: string | null;

  @ManyToOne(() => Personnel) // inverse side?
  personnel?: Personnel;

  /**
   * Appointment may be unrelated to service, e.g. vacation/other blockers
   */
  @ManyToOne(() => Service, { nullable: true })
  service?: Service | null;

  @ManyToOne(() => Company)
  @Exclude()
  company?: Company;
}
