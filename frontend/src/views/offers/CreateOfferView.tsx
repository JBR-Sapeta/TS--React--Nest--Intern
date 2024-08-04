import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { CreateOfferForm } from '@Containers/offer';
import { useGetUserCompany } from '@Data/query/company';
import { useGetUserProfile } from '@Data/query/user';

export function CreateOfferView(): ReactElement {
  const { userProfile } = useGetUserProfile();
  const { company } = useGetUserCompany({ userId: userProfile?.id });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="medium">
      {company && (
        <CreateOfferForm branches={company.branches} companyId={company.id} />
      )}
    </ContentRow>
  );
}
