import { Navigate, Outlet } from 'react-router';
import { isNil } from 'ramda';

import { UserRole } from '@Common/enums';
import { hasRoles } from '@Common/functions';
import { useGetAccessToken, useGetUserProfile } from '@Data/auth';
import { ROUTER_PATHS } from '@Router/constants';

function UserRouteGuard() {
  const { accessToken } = useGetAccessToken();
  const { userProfile } = useGetUserProfile(accessToken);

  if (isNil(userProfile)) {
    return <Navigate to={ROUTER_PATHS.AUTH} />;
  }

  if (!hasRoles(userProfile.roles, [UserRole.USER])) {
    return <Navigate to={ROUTER_PATHS.OFFERS} />;
  }

  return <Outlet />;
}

export default UserRouteGuard;
