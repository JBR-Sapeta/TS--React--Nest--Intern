import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { ResetForm } from '@Containers/auth';

function ResetView(): ReactElement {
  return (
    <ContentRow margin="large">
      <ResetForm />
    </ContentRow>
  );
}

export default ResetView;
