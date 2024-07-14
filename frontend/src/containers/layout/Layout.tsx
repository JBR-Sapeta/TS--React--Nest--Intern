import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './footer/Footer';
import Header from './header/Header';
import Main from './main/Main';

type Props = {
  children?: ReactElement;
};

function Layout({ children }: Props): ReactElement {
  return (
    <>
      <Header />
      <Main>
        {children}
        <Outlet />
      </Main>
      <Footer />
    </>
  );
}

export default Layout;
