import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'employment_types' })
export class EmploymentTypeEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;
}
