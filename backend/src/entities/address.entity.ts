import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  Point,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BranchEntity } from './branch.entity';

@Entity({ name: 'addresses' })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  public country: string;

  @Column({ type: 'varchar', length: 64 })
  public region: string;

  @Column({ type: 'varchar', length: 32 })
  public postcode: string;

  @Column({ type: 'varchar', length: 64 })
  public city: string;

  @Column({ type: 'varchar', length: 64 })
  public streetName: string;

  @Column({ type: 'varchar', length: 16 })
  public houseNumber: string;

  @Column({ type: 'double precision' })
  public lat: number;

  @Column({ type: 'double precision' })
  public long: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @OneToOne(() => BranchEntity, (branch: BranchEntity) => branch.address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'branch_id' })
  public branch: BranchEntity;

  @Column({ name: 'branch_id', nullable: true })
  public branchId: number;
}
