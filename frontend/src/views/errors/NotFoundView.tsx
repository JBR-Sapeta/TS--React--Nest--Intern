import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { NotFound } from '@Containers/errors';

function NotFoundView(): ReactElement {
  return (
    <ContentRow margin="medium">
      <NotFound />
    </ContentRow>
  );
}

export default NotFoundView;
