import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'addresses' })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 31 })
  public country: string;

  @Column({ type: 'varchar', length: 31 })
  public region: string;

  @Column({ type: 'varchar', length: 15 })
  public postcode: string;

  @Column({ type: 'varchar', length: 63 })
  public city: string;

  @Column({ type: 'varchar', length: 63 })
  public streetName: string;

  @Column({ type: 'varchar', length: 15 })
  public addressNumber: string;

  @Column({ type: 'double' })
  public latitude: number;

  @Column({ type: 'double' })
  public longitude: number;
}
