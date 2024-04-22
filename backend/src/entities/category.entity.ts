import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @ManyToOne(() => CategoryEntity, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: CategoryEntity;

  @Column({ name: 'parent_id', nullable: true, default: null })
  parentId: number | null;

  @OneToMany(() => CategoryEntity, (category) => category.parent, {
    eager: true,
  })
  children: CategoryEntity[];
}
