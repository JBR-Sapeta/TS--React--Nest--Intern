import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  public name: string;

  @ManyToMany(() => UserEntity, (user: UserEntity) => user.roles)
  public users: RoleEntity[];
}
