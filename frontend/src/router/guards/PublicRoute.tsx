import { Navigate, Outlet } from 'react-router';

import { useGetUserProfile } from '@Data/user';
import { ROUTER_PATHS } from '@Router/constants';

export default function PublicRoute() {
  const { userProfile } = useGetUserProfile();

  if (userProfile) {
    return <Navigate to={ROUTER_PATHS.OFFERS} />;
  }

  return <Outlet />;
}
