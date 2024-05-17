import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BranchEntity } from './branch.entity';
import { OfferEntity } from './offer.entity';

@Entity({ name: 'companies' })
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  public name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  public slug: string;

  @Column({ type: 'varchar', length: 255 })
  public email: string;

  @Column({ type: 'varchar', length: 15, nullable: true, default: null })
  public phoneNumber: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true, default: null })
  public logoUrl: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true, default: null })
  public mainPhotoUrl: string | null;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'int' })
  public size: number;

  @Column({ type: 'boolean', default: false })
  public isVerified: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @Column({ name: 'user_id' })
  public userId: string;

  @OneToMany(() => BranchEntity, (branch: BranchEntity) => branch.company)
  public branches: BranchEntity[];

  @OneToMany(() => OfferEntity, (offer: OfferEntity) => offer.company)
  public offers: OfferEntity[];
}
