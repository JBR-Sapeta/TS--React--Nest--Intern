import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { CreateCompanyForm } from '@Containers/company';

export function CreateCompanyView(): ReactElement {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="medium">
      <CreateCompanyForm />
    </ContentRow>
  );
}
