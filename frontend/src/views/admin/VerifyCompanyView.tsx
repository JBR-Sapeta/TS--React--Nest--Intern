import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { VerifyCompanyListing } from '@Containers/admin';

export function VerifyCompanyView(): ReactElement {
  return (
    <ContentRow margin="medium">
      <VerifyCompanyListing />
    </ContentRow>
  );
}
