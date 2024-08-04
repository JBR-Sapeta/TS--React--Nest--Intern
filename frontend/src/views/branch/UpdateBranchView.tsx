import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { Navigate, useParams } from 'react-router';
import { isNil } from 'ramda';

import { Nullable } from '@Common/types';
import { ContentRow } from '@Containers/content';
import { UpdateBranchForm } from '@Containers/branch';
import { useGetUserCompany } from '@Data/query/company';
import { useGetUserProfile } from '@Data/query/user';
import { ROUTER_PATHS } from '@Router/constants';

export function UpdateBranchView(): Nullable<ReactElement> {
  const { userProfile } = useGetUserProfile();
  const { company } = useGetUserCompany({ userId: userProfile?.id });
  const { branchId } = useParams();
  const numericBranchId = Number(branchId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (Number.isNaN(numericBranchId)) {
    return <Navigate to={ROUTER_PATHS.COMPANY_VIEW} />;
  }

  if (isNil(company)) {
    return null;
  }

  const branch = company.branches.find((val) => val.id === numericBranchId);

  return (
    <ContentRow margin="medium">
      {branch && <UpdateBranchForm companyId={company.id} branch={branch} />}
    </ContentRow>
  );
}
