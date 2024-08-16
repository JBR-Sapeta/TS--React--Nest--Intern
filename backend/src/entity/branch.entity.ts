import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';
import { CompanyEntity } from './company.entity';
import { OfferEntity } from './offer.entity';

@Entity({ name: 'branches' })
export class BranchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @OneToOne(() => AddressEntity, (address: AddressEntity) => address.branch, {
    eager: true,
    cascade: true,
  })
  public address: AddressEntity;

  @ManyToOne(
    () => CompanyEntity,
    (company: CompanyEntity) => company.branches,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'company_id' })
  public company: CompanyEntity;

  @Column({ name: 'company_id' })
  public companyId: string;

  @ManyToMany(() => OfferEntity, (offer: OfferEntity) => offer.branches)
  public offers: OfferEntity[];
}
