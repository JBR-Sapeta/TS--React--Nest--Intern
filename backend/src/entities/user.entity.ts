import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { UserRoleEntity } from './user-role.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: true, default: null })
  phoneNumber: string | null;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 63, nullable: true })
  activationToken: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;

  @Column({ type: 'varchar', length: 63, nullable: true, default: null })
  resetToken: string | null;

  @Column({ nullable: true, default: null })
  resetTokenExpirationDate: Date | null;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => UserRoleEntity)
  @JoinTable({ name: 'users_user_roles' })
  public roles: UserRoleEntity[];
}
