import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { NotFound } from '@Containers/errors';
import { Layout } from '@Containers/layout';

function NotFoundView(): ReactElement {
  return (
    <Layout>
      <ContentRow margin="medium">
        <NotFound />
      </ContentRow>
    </Layout>
  );
}

export default NotFoundView;
