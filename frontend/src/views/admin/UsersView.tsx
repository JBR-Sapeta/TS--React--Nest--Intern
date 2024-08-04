import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { UserListing } from '@Containers/admin';

export function UsersView(): ReactElement {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="medium">
      <UserListing />
    </ContentRow>
  );
}
