import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './footer/Footer';
import Header from './header/Header';
import Main from './main/Main';

function Layout(): ReactElement {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
}

export default Layout;
