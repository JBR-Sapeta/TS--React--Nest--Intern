import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { CreateCompanyForm } from '@Containers/company';

export function CreateCompanyView(): ReactElement {
  return (
    <ContentRow margin="medium">
      <CreateCompanyForm />
    </ContentRow>
  );
}
