import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'branches' })
export class BranchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
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

  @Column({ name: 'company_id', nullable: false })
  public companyId: string;
}
