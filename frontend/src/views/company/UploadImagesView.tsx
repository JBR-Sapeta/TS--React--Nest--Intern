import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { UploadImagesForm } from '@Containers/company';
import { useGetUserCompany } from '@Data/query/company';
import { useGetUserProfile } from '@Data/query/user';

export function UploadImagesView(): ReactElement {
  const { userProfile } = useGetUserProfile();
  const { company } = useGetUserCompany({ userId: userProfile?.id });

  return (
    <ContentRow margin="medium">
      {company && <UploadImagesForm {...company} />}
    </ContentRow>
  );
}
