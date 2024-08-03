import type { ReactElement } from 'react';
import { Navigate, useParams } from 'react-router';
import { isNotNil } from 'ramda';

import { ContentRow } from '@Containers/content';
import { useGetOffer } from '@Data/query/offer';
import { ROUTER_PATHS } from '@Router/constants';
import { Offer } from '@Containers/offer';
import { useGetUserProfile } from '@Data/query/user';

export function OfferView(): ReactElement {
  const { offerId, companyId } = useParams();
  const { userProfile } = useGetUserProfile();
  const { offer, error } = useGetOffer({
    offerId: offerId || '',
    companyId: companyId || '',
  });

  return isNotNil(error) ? (
    <Navigate to={ROUTER_PATHS.NOT_FOUND} />
  ) : (
    <ContentRow margin="small">
      {offer && (
        <Offer {...offer} applications={userProfile?.applications || []} />
      )}
    </ContentRow>
  );
}
