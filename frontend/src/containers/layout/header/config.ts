import { Users } from '@Common/enums';
import type { NavtigationLink } from '@Common/types';
import { ROUTER_PATHS } from '@Router/constants';

const BASE_NAVIGATION_LINKS: NavtigationLink[] = [
  { label: 'Oferty', path: ROUTER_PATHS.OFFERS },
  { label: 'Firmy', path: ROUTER_PATHS.COMPANIES },
  { label: 'Zaloguj się', path: ROUTER_PATHS.AUTH },
];

const USER_NAVIGATION_LINKS: NavtigationLink[] = [
  { label: 'Oferty', path: ROUTER_PATHS.OFFERS },
  { label: 'Firmy', path: ROUTER_PATHS.COMPANIES },
  { label: 'Zaloguj się', path: ROUTER_PATHS.AUTH },
];

const COMPANY_NAVIGATION_LINKS: NavtigationLink[] = [
  { label: 'Oferty', path: ROUTER_PATHS.OFFERS },
  { label: 'Firmy', path: ROUTER_PATHS.COMPANIES },
  { label: 'Zaloguj się', path: ROUTER_PATHS.AUTH },
];

const ADMIN_NAVIGATION_LINKS: NavtigationLink[] = [
  { label: 'Oferty', path: ROUTER_PATHS.OFFERS },
  { label: 'Firmy', path: ROUTER_PATHS.COMPANIES },
  { label: 'Zaloguj się', path: ROUTER_PATHS.AUTH },
];

class NavigationLinksMap {
  private data: Map<string, NavtigationLink[]>;

  constructor() {
    this.data = new Map([
      [Users.BASE, BASE_NAVIGATION_LINKS],
      [Users.USER, USER_NAVIGATION_LINKS],
      [Users.COMPANY, COMPANY_NAVIGATION_LINKS],
      [Users.ADMIN, ADMIN_NAVIGATION_LINKS],
    ]);
  }

  public get(key: string): NavtigationLink[] {
    const navigationLinks = this.data.get(key);

    return navigationLinks || this.data.get(Users.BASE)!;
  }
}

export const NAVIGATION_LINKS = new NavigationLinksMap();
