import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OfferEntity } from './offer.entity';

@Entity({ name: 'operating_modes' })
export class OperatingModeEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @OneToMany(() => OfferEntity, (offer: OfferEntity) => offer.operatingMode)
  public offers: OfferEntity[];
}
