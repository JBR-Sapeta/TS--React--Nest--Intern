import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

import type { MediaLink, NavigationLink } from '@Common/types';
import { ROUTER_PATHS } from '@Router/constants';

export const USER_LINKS: NavigationLink[] = [
  { label: 'Regulamin', path: '/terms-of-service' },
  { label: 'Oferty', path: ROUTER_PATHS.OFFERS },
  { label: 'Firmy', path: ROUTER_PATHS.COMPANIES },
];

export const COMPANY_LINKS: NavigationLink[] = [
  { label: 'Regulamin', path: '/terms-of-service' },
  { label: 'Oferta', path: '/oferta' },
  { label: 'Pomoc', path: '/help' },
];

export const MEDIA_LINKS: MediaLink[] = [
  { label: 'Facebook', href: 'https://www.google.pl/', Icon: FaFacebook },
  { label: 'Linkedin', href: 'https://www.google.pl/', Icon: FaLinkedin },
  { label: 'Email', href: 'mailto:johndoe@mail.com', Icon: MdEmail },
];
