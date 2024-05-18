import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OfferEntity } from './offer.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @ManyToOne(() => CategoryEntity, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  public parent: CategoryEntity;

  @Column({ name: 'parent_id', nullable: true, default: null })
  public parentId: number | null;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  public children: CategoryEntity[];

  @ManyToMany(() => OfferEntity, (offer: OfferEntity) => offer.categories)
  public offers: OfferEntity[];

  @ManyToMany(
    () => CompanyEntity,
    (company: CompanyEntity) => company.categories,
  )
  public companies: CompanyEntity[];
}
