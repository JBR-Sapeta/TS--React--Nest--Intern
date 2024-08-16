import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OfferEntity } from './offer.entity';

@Entity({ name: 'employment_types' })
export class EmploymentTypeEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @OneToMany(() => OfferEntity, (offer: OfferEntity) => offer.employmentType)
  public offers: OfferEntity[];
}
