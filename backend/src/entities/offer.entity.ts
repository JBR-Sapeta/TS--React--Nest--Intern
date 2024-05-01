import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BranchEntity } from './branch.entity';
import { CategoryEntity } from './category.entity';
import { EmploymentTypeEntity } from './employment-type.entity';
import { OperatingModeEntity } from './operating-mode.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'offers' })
export class OfferEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 64 })
  public title: string;

  @Column({ type: 'varchar', length: 64 })
  public position: string;

  @Column({ type: 'varchar', length: 3072 })
  public description: string;

  @Column({ type: 'boolean', default: false })
  public isPaid: boolean;

  @Column({ type: 'boolean', default: false })
  public isActive: boolean;

  @Column()
  public expirationDate: Date;

  @Column()
  public removalDate: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => EmploymentTypeEntity)
  @JoinColumn({ name: 'employment_type_id' })
  public employmentType: EmploymentTypeEntity;

  @Column({ name: 'employment_type_id', nullable: false })
  public employmentTypeId: number;

  @ManyToOne(() => OperatingModeEntity)
  @JoinColumn({ name: 'operating_mode_id' })
  public operatingMode: OperatingModeEntity;

  @Column({ name: 'operating_mode_id', nullable: false })
  public operatingModeId: number;

  @ManyToMany(() => BranchEntity, { eager: true })
  @JoinTable({ name: 'offers_branches' })
  public branches: BranchEntity[];

  @ManyToMany(() => CategoryEntity, { eager: true })
  @JoinTable({ name: 'offers_categories' })
  public categories: CategoryEntity[];

  @ManyToOne(() => CompanyEntity, (company: CompanyEntity) => company.offers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  public company: CompanyEntity;

  @Column({ name: 'company_id', nullable: false })
  public companyId: string;
}
