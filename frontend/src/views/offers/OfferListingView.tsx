import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { OfferListing } from '@Containers/offer';
import { useGetUserProfile } from '@Data/query/user';

function OfferListingView(): ReactElement {
  const { userProfile } = useGetUserProfile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentRow margin="small">
      <OfferListing applications={userProfile?.applications || []} />
    </ContentRow>
  );
}

export default OfferListingView;
