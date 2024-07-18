import { Navigate, Outlet } from 'react-router';

import { useGetAccessToken, useGetUserProfile } from '@Data/auth';
import { ROUTER_PATHS } from '@Router/constants';

export default function PublicRoute() {
  const { accessToken } = useGetAccessToken();
  const { userProfile } = useGetUserProfile(accessToken);

  if (userProfile) {
    return <Navigate to={ROUTER_PATHS.OFFERS} />;
  }

  return <Outlet />;
}
