import { Navigate, Outlet } from 'react-router';
import { isNil } from 'ramda';

import { UserRole } from '@Common/enums';
import { hasRoles } from '@Common/functions';
import { useGetUserProfile } from '@Data/query/user';
import { ROUTER_PATHS } from '@Router/constants';

function CompanyRouteGuard() {
  const { userProfile } = useGetUserProfile();

  if (isNil(userProfile)) {
    return <Navigate to={ROUTER_PATHS.AUTH} />;
  }

  if (!hasRoles(userProfile.roles, [UserRole.ADMIN])) {
    return <Navigate to={ROUTER_PATHS.OFFERS} />;
  }

  return <Outlet />;
}

export default CompanyRouteGuard;
