import type { ReactElement } from 'react';
import { createRoutesFromElements, RouterProvider } from 'react-router';
import { createBrowserRouter, Route } from 'react-router-dom';

import { Layout } from '@Containers/layout';

import { SignInView } from '@Views/auth';
import { CompanyListingView } from '@Views/companies';
import { OfferListingView } from '@Views/offers';

import { ROUTER_PATHS } from './constants';

const ROUTER = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path={ROUTER_PATHS.COMPANIES} element={<OfferListingView />} />
      <Route path={ROUTER_PATHS.OFFERS} element={<CompanyListingView />} />
      <Route path={ROUTER_PATHS.AUTH} element={<SignInView />} />
    </Route>
  )
);

export default function Router(): ReactElement {
  return <RouterProvider router={ROUTER} />;
}
