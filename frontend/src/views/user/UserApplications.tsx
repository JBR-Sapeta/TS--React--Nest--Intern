import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { ApplicationsListing } from '@Containers/user';
import { useGetUserProfile } from '@Data/query/user';

export function UserApplications(): ReactElement {
  const { userProfile } = useGetUserProfile();

  return (
    <ContentRow margin="medium">
      {userProfile && <ApplicationsListing userId={userProfile.id} />}
    </ContentRow>
  );
}
