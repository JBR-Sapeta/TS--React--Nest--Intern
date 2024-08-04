import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { Navigate, useParams } from 'react-router';

import { CompanyProfil } from '@Containers/company';
import { ContentRow } from '@Containers/content';
import { useGetCompanyBySlug } from '@Data/query/company';
import { isValidSlug } from '@Common/validation';
import { isEmpty, isNil, isNotNil } from 'ramda';
import { ROUTER_PATHS } from '@Router/constants';

function checkSlug(slug?: string): boolean {
  if (isNil(slug)) return false;

  const error = isValidSlug(slug);

  return isEmpty(error);
}

export function CompanyView(): ReactElement {
  const { slug } = useParams();
  const isValid = checkSlug(slug);
  const { company, error } = useGetCompanyBySlug({
    slug: slug || '',
    isValid,
  });

  const isInvalidRoute = !isValid || isNotNil(error);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return isInvalidRoute ? (
    <Navigate to={ROUTER_PATHS.NOT_FOUND} />
  ) : (
    <ContentRow margin="small">
      {company && <CompanyProfil {...company} />}
    </ContentRow>
  );
}
