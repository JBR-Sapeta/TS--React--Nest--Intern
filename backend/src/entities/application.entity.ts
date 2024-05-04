import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OfferEntity } from './offer.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'applications' })
export class ApplicationEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 512 })
  public message: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @Column({ type: 'text' })
  public fileUrl: string;

  @Column({ type: 'boolean', default: false })
  public isDownloaded: boolean;

  @ManyToOne(() => OfferEntity, (offer: OfferEntity) => offer.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'offer_id' })
  public offer: OfferEntity;

  @Column({ name: 'offer_id' })
  public offerId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @Column({ name: 'user_id' })
  public userId: string;
}
