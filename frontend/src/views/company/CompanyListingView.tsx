import type { ReactElement } from 'react';

import { CompanyListing } from '@Containers/company';
import { ContentRow } from '@Containers/content';

export function CompanyListingView(): ReactElement {
  return (
    <ContentRow margin="small">
      <CompanyListing />
    </ContentRow>
  );
}
