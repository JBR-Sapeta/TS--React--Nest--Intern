import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { VerifyCompanyListing } from '@Containers/admin';

export function VerifyCompanyView(): ReactElement {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <ContentRow margin="medium">
      <VerifyCompanyListing />
    </ContentRow>
  );
}
