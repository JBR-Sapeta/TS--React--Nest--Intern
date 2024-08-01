import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { UserListing } from '@Containers/admin';

export function UsersView(): ReactElement {
  return (
    <ContentRow margin="medium">
      <UserListing />
    </ContentRow>
  );
}
