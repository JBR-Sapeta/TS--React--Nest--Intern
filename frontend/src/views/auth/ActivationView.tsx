import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { ActivationMessage } from '@Containers/auth';

function ActivationView(): ReactElement {
  return (
    <ContentRow margin="medium">
      <ActivationMessage />
    </ContentRow>
  );
}

export default ActivationView;
