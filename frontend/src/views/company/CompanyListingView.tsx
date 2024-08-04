import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { CompanyListing } from '@Containers/company';
import { ContentRow } from '@Containers/content';

export function CompanyListingView(): ReactElement {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="small">
      <CompanyListing />
    </ContentRow>
  );
}
