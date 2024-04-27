import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'operating_modes' })
export class OperatingModeEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;
}
