import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { UserProfile } from '@Containers/user';

function ProfileView(): ReactElement {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="medium">
      <UserProfile />
    </ContentRow>
  );
}

export default ProfileView;
