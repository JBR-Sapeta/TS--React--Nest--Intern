import { UserRole } from '@Common/enums';
import type { NavigationLink } from '@Common/types';
import { ROUTER_PATHS } from '@Router/constants';

const BASE_NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Oferty', path: ROUTER_PATHS.OFFERS },
  { label: 'Firmy', path: ROUTER_PATHS.COMPANIES },
  { label: 'Zaloguj się', path: ROUTER_PATHS.AUTH },
];

const USER_NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Oferty', path: ROUTER_PATHS.OFFERS },
  { label: 'Firmy', path: ROUTER_PATHS.COMPANIES },
  { label: 'Profil', path: ROUTER_PATHS.PROFILE },
];

const COMPANY_NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Moje Oferty', path: ROUTER_PATHS.COMPANY_OFFERS },
  { label: 'Moja firma', path: ROUTER_PATHS.COMPANY },
  { label: 'Profil', path: ROUTER_PATHS.PROFILE },
];

const ADMIN_NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Oferty', path: ROUTER_PATHS.OFFERS },
  { label: 'Firmy', path: ROUTER_PATHS.COMPANIES },
  { label: 'Profil', path: ROUTER_PATHS.PROFILE },
];

class NavigationLinksMap {
  private data: Map<number, NavigationLink[]>;

  constructor() {
    this.data = new Map([
      [UserRole.BASE, BASE_NAVIGATION_LINKS],
      [UserRole.USER, USER_NAVIGATION_LINKS],
      [UserRole.COMPANY, COMPANY_NAVIGATION_LINKS],
      [UserRole.ADMIN, ADMIN_NAVIGATION_LINKS],
    ]);
  }

  public get(key: number): NavigationLink[] {
    const navigationLinks = this.data.get(key);

    return navigationLinks || this.data.get(UserRole.BASE)!;
  }
}

export const NAVIGATION_LINKS = new NavigationLinksMap();
