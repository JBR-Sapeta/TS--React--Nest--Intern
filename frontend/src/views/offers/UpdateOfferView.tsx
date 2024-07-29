import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router';

import { ContentRow } from '@Containers/content';
import { WrappedUpdateOfferForm } from '@Containers/offer';
import { useGetUserCompany } from '@Data/query/company';
import { useGetUserProfile } from '@Data/query/user';
import { ROUTER_PATHS } from '@Router/constants';

export function UpdateOfferView(): ReactElement {
  const navigate = useNavigate();
  const { userProfile } = useGetUserProfile();
  const { company } = useGetUserCompany({ userId: userProfile?.id });
  const { offerId } = useParams();

  const numericOfferId = Number(offerId);

  if (Number.isNaN(numericOfferId)) {
    navigate(ROUTER_PATHS.COMPANY_OFFERS);
  }

  return (
    <ContentRow margin="medium">
      {company && (
        <WrappedUpdateOfferForm
          branches={company.branches}
          companyId={company.id}
          offerId={numericOfferId}
        />
      )}
    </ContentRow>
  );
}
