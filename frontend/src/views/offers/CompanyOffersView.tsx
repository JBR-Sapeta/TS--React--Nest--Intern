import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { CompanyOffers } from '@Containers/offer';
import { useGetUserCompany } from '@Data/query/company';
import { useGetUserProfile } from '@Data/query/user';

export function CompanyOffersView(): ReactElement {
  const { userProfile } = useGetUserProfile();
  const { company } = useGetUserCompany({ userId: userProfile?.id });

  return (
    <ContentRow margin="medium">
      {company && <CompanyOffers companyId={company.id} />}
    </ContentRow>
  );
}
