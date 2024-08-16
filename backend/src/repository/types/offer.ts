import { BranchEntity } from '../../entity/branch.entity';
import { CategoryEntity } from '../../entity/category.entity';
import { CompanyEntity } from '../../entity/company.entity';
import { EmploymentTypeEntity } from '../../entity/employment-type.entity';
import { OperatingModeEntity } from '../../entity/operating-mode.entity';

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
