import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { InternalServerError } from '@Containers/errors';
import { Layout } from '@Containers/layout';

function InternalServerErrorView(): ReactElement {
  return (
    <Layout>
      <ContentRow margin="medium">
        <InternalServerError />
      </ContentRow>
    </Layout>
  );
}

export default InternalServerErrorView;
