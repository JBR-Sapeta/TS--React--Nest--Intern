import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { RoleEntity } from './role.entity';
import { ApplicationEntity } from './application.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255 })
  public firstName: string;

  @Column({ type: 'varchar', length: 255 })
  public lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  public email: string;

  @Column({ type: 'varchar', length: 15, nullable: true, default: null })
  public phoneNumber: string | null;

  @Column({ type: 'varchar', length: 255 })
  public password: string;

  @Column({ type: 'varchar', length: 63, nullable: true })
  public activationToken: string | null;

  @Column({ type: 'text', nullable: true })
  public refreshToken: string | null;

  @Column({ type: 'varchar', length: 63, nullable: true, default: null })
  public resetToken: string | null;

  @Column({ nullable: true, default: null })
  public resetTokenExpirationDate: Date | null;

  @Column({ default: false })
  public isActive: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToMany(() => RoleEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'users_roles' })
  public roles: RoleEntity[];

  @OneToMany(
    () => ApplicationEntity,
    (application: ApplicationEntity) => application.user,
  )
  public applications: ApplicationEntity[];
}
