import type { ReactElement } from 'react';
import { createRoutesFromElements, RouterProvider } from 'react-router';
import { createBrowserRouter, Route } from 'react-router-dom';

import { Layout } from '@Containers/layout';

import { ActivationView, PostRegistrationView, SignInView } from '@Views/auth';
import { CompanyListingView } from '@Views/companies';
import { NotFoundView } from '@Views/errors';
import { OfferListingView } from '@Views/offers';

import { ROUTER_PATHS } from './constants';

const ROUTER = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<NotFoundView />}>
      <Route path={ROUTER_PATHS.COMPANIES} element={<OfferListingView />} />
      <Route path={ROUTER_PATHS.OFFERS} element={<CompanyListingView />} />
      <Route path={ROUTER_PATHS.AUTH} element={<SignInView />} />
      <Route path={ROUTER_PATHS.POST_AUTH} element={<PostRegistrationView />} />
      <Route path={ROUTER_PATHS.ACTIVATION} element={<ActivationView />} />
    </Route>
  )
);

export default function Router(): ReactElement {
  return <RouterProvider router={ROUTER} />;
}
