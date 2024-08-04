import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { UserCompany } from '@Containers/company';
import { useGetUserProfile } from '@Data/query/user';
import { useGetUserCompany } from '@Data/query/company';

export function UserCompanyView(): ReactElement {
  const { userProfile } = useGetUserProfile();
  const { company } = useGetUserCompany({ userId: userProfile?.id });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="medium">
      {company && <UserCompany {...company} />}
    </ContentRow>
  );
}
