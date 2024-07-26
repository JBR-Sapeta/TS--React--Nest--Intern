import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { UpdateCompanyForm } from '@Containers/company';
import { useGetUserCompany } from '@Data/query/company';
import { useGetUserProfile } from '@Data/query/user';

export function UpdateCompanyView(): ReactElement {
  const { userProfile } = useGetUserProfile();
  const { company } = useGetUserCompany({ userId: userProfile?.id });

  return (
    <ContentRow margin="medium">
      {company && <UpdateCompanyForm {...company} />}
    </ContentRow>
  );
}
