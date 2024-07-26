import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { UserCompany } from '@Containers/company';
import { useGetUserProfile } from '@Data/query/user';

export function UserCompanyView(): ReactElement {
  const { userProfile } = useGetUserProfile();

  return (
    <ContentRow margin="medium">
      {userProfile && <UserCompany userId={userProfile.id} />}
    </ContentRow>
  );
}
