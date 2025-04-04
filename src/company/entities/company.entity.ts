import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: String, nullable: true })
  name: string | null;

  @Column()
  hashedPassword: string;

  @Column({ type: String, nullable: true })
  hashedVerificationToken: string | null;

  @Column({ type: Date, nullable: true })
  verificationTokenExpiresAt: Date | null;

  @Column()
  verified: boolean;
}
