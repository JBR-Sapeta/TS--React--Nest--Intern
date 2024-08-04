import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { ApplicationsListing } from '@Containers/user';
import { useGetUserProfile } from '@Data/query/user';

export function UserApplications(): ReactElement {
  const { userProfile } = useGetUserProfile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="medium">
      {userProfile && <ApplicationsListing userId={userProfile.id} />}
    </ContentRow>
  );
}
