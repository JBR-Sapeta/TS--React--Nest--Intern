import { BranchEntity } from '../../entities/branch.entity';
import { CategoryEntity } from '../../entities/category.entity';
import { CompanyEntity } from '../../entities/company.entity';
import { EmploymentTypeEntity } from '../../entities/employment-type.entity';
import { OperatingModeEntity } from '../../entities/operating-mode.entity';

export type CreateOfferData = {
  title: string;
  position: string;
  description: string;
  isPaid: boolean;
  isActive: boolean;
  expirationDate: Date;
  removalDate: Date;
  employmentType: EmploymentTypeEntity;
  operatingMode: OperatingModeEntity;
  branches: BranchEntity[];
  categories: CategoryEntity[];
  company: CompanyEntity;
};

export type UpdateOfferData = {
  title?: string;
  position?: string;
  description?: string;
  isPaid?: boolean;
  isActive?: boolean;
  employmentType?: EmploymentTypeEntity;
  operatingMode?: OperatingModeEntity;
  branches?: BranchEntity[];
  categories?: CategoryEntity[];
};
