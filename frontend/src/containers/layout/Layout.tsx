import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';

function Layout(): ReactElement {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
}

export default Layout;
