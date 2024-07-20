import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { UserProfile } from '@Containers/user';

function ProfileView(): ReactElement {
  return (
    <ContentRow margin="medium">
      <UserProfile />
    </ContentRow>
  );
}

export default ProfileView;
