import type { ReactElement } from 'react';
import {
  createRoutesFromElements,
  Navigate,
  RouterProvider,
} from 'react-router';
import { createBrowserRouter, Route } from 'react-router-dom';

import { Layout } from '@Containers/layout';
import { useStorageSynchronize } from '@Data/query/auth';
import { useGetUserProfile } from '@Data/query/user';

import {
  ActivationView,
  PostRegistrationView,
  ResetView,
  SignInView,
} from '@Views/auth';
import { CompanyListingView } from '@Views/companies';
import {
  CreateCompanyView,
  UpdateCompanyView,
  UploadImagesView,
  UserCompanyView,
} from '@Views/company';
import { NotFoundView } from '@Views/errors';
import { OfferListingView } from '@Views/offers';
import { ProfileView } from '@Views/user';

import { ROUTER_PATHS } from './constants';
import {
  AdminRouteGuard,
  CompanyRouteGuard,
  ProtectedRoute,
  PublicRoute,
  UserRouteGuard,
} from './guards';

const ROUTER = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<NotFoundView />}>
      <Route path="/" element={<Navigate to={ROUTER_PATHS.OFFERS} />} />
      <Route path={ROUTER_PATHS.COMPANIES} element={<OfferListingView />} />
      <Route
        path={`${ROUTER_PATHS.COMPANIES}/:companyId`}
        element={<CompanyListingView />}
      />
      <Route path={ROUTER_PATHS.OFFERS} element={<OfferListingView />} />
      <Route
        path={`${ROUTER_PATHS.OFFERS}/:offerId`}
        element={<CompanyListingView />}
      />

      <Route element={<PublicRoute />}>
        <Route path={ROUTER_PATHS.AUTH} element={<SignInView />} />
        <Route
          path={ROUTER_PATHS.POST_AUTH}
          element={<PostRegistrationView />}
        />
        <Route path={ROUTER_PATHS.ACTIVATION} element={<ActivationView />} />
        <Route path={ROUTER_PATHS.RESET} element={<ResetView />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTER_PATHS.PROFILE} element={<ProfileView />} />
      </Route>

      <Route element={<UserRouteGuard />}>
        <Route
          path={ROUTER_PATHS.CREATE_COMPANY}
          element={<CreateCompanyView />}
        />
        <Route
          path={ROUTER_PATHS.APPLICATIONS}
          element={<PostRegistrationView />}
        />
      </Route>

      <Route element={<CompanyRouteGuard />}>
        <Route path={ROUTER_PATHS.COMPANY} element={<UserCompanyView />} />
        <Route
          path={ROUTER_PATHS.COMPANY_UPDATE}
          element={<UpdateCompanyView />}
        />
        <Route
          path={ROUTER_PATHS.COMPANY_UPLOAD}
          element={<UploadImagesView />}
        />
      </Route>

      <Route element={<AdminRouteGuard />}>
        <Route path={ROUTER_PATHS.USERS} element={<PostRegistrationView />} />
      </Route>
    </Route>
  )
);

export default function Router(): ReactElement {
  const { userProfile } = useGetUserProfile();
  useStorageSynchronize(userProfile);

  return <RouterProvider router={ROUTER} />;
}
