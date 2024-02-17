import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Roles } from '../common/enums';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, default: null })
  phoneNumber: string | null;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    array: true,
    default: [Roles.USER],
  })
  roles: Roles[];

  @Column({ nullable: true })
  activationToken: string | null;

  @Column({ nullable: true })
  refreshToken: string | null;

  @Column({ nullable: true, default: null })
  resetToken: string | null;

  @Column({ nullable: true, default: null })
  resetTokenExpirationDate: Date | null;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
