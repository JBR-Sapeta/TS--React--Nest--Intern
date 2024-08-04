import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { CreateBranchForm } from '@Containers/branch';
import { useGetUserCompany } from '@Data/query/company';
import { useGetUserProfile } from '@Data/query/user';

export function CreateBranchView(): ReactElement {
  const { userProfile } = useGetUserProfile();
  const { company } = useGetUserCompany({ userId: userProfile?.id });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="medium">
      {company && <CreateBranchForm companyId={company.id} />}
    </ContentRow>
  );
}
