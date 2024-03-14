import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'branches' })
export class BranchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public name: string;

  @OneToOne(() => AddressEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  address: AddressEntity;

  @ManyToOne(() => CompanyEntity, (company: CompanyEntity) => company.branches)
  public company: CompanyEntity;
}
