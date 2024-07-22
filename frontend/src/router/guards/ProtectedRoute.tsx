import { Navigate, Outlet } from 'react-router';
import { isNil } from 'ramda';

import { UserRole } from '@Common/enums';
import { hasRoles } from '@Common/functions';
import { useGetUserProfile } from '@Data/query/user';
import { ROUTER_PATHS } from '@Router/constants';

const REQUIRED_ROLE = [UserRole.USER, UserRole.COMPANY, UserRole.ADMIN];

function ProtectedRoute() {
  const { userProfile } = useGetUserProfile();

  if (isNil(userProfile)) {
    return <Navigate to={ROUTER_PATHS.AUTH} />;
  }

  if (!hasRoles(userProfile.roles, REQUIRED_ROLE)) {
    return <Navigate to={ROUTER_PATHS.OFFERS} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
