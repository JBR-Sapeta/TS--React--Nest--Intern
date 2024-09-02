import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { ROUTER_PATHS } from '@Router/constants';

import { CompanyListingItem } from './CompanyListingItem';

const ADDRESS = {
  id: 4,
  country: 'Polska',
  region: 'województwo małopolskie',
  postcode: '31-946',
  city: 'Kraków',
  streetName: 'Osiedle Teatralne',
  houseNumber: '19',
  lat: 50.078917,
  long: 20.032729,
};

const BRANCH = {
  id: 1231,
  name: 'New Company - Cracov',
  createdAt: '2024-09-01T20:00:09.520Z',
  address: ADDRESS,
};

const CATEGORIES = [
  { id: 1, name: 'Administracja' },
  { id: 2, name: 'Budownictwo' },
  { id: 3, name: 'Gastronomia' },
  { id: 4, name: 'Finanse' },
  { id: 5, name: 'Uroda' },
  { id: 6, name: 'Motoryzacja' },
  { id: 7, name: 'Górnictwo' },
  { id: 8, name: 'Przemysł' },
  { id: 9, name: 'Usługi' },
];
const LOCATIONS = ['Warszawa', 'Kraków', 'Gdańsk', 'Sopot', 'Katowice'];

const PROPS = {
  id: '8df7580e-1529-4ccd-93cc-d020c738141d',
  name: 'New Company',
  slug: 'new-company',
  logoUrl: '/logo.png',
  size: 123,
  locations: ['Warszawa', 'Kraków', 'Gdańsk'],
  branches: [BRANCH],
  categories: [
    { id: 1, name: 'Administracja' },
    { id: 2, name: 'Budownictwo' },
  ],
};

describe('CompanyListingItem', () => {
  it('renders link to company view', () => {
    render(
      <MemoryRouter>
        <CompanyListingItem {...PROPS} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    const linkValue = `${ROUTER_PATHS.COMPANIES}/${PROPS.slug}`;

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', linkValue);
  });

  it('renders company logo', () => {
    render(
      <MemoryRouter>
        <CompanyListingItem {...PROPS} />
      </MemoryRouter>
    );

    const companyLogo = screen.getByAltText(/logo firmy/i);

    expect(companyLogo).toBeInTheDocument();
    expect(companyLogo).toHaveAttribute('src', PROPS.logoUrl);
  });

  it('renders h3 with company name name', () => {
    render(
      <MemoryRouter>
        <CompanyListingItem {...PROPS} />
      </MemoryRouter>
    );

    const comapnyName = screen.getByRole('heading', { level: 3 });

    expect(comapnyName).toHaveTextContent(PROPS.name);
  });

  it('renders number of company workers', () => {
    render(
      <MemoryRouter>
        <CompanyListingItem {...PROPS} />
      </MemoryRouter>
    );

    const companySize = screen.getByText(new RegExp(`${PROPS.size}`, 'i'));

    expect(companySize).toBeInTheDocument();
  });

  it('renders all locations iflength of locations array is samller or equal 3', () => {
    render(
      <MemoryRouter>
        <CompanyListingItem {...PROPS} />
      </MemoryRouter>
    );

    const locations = screen.getByText(
      new RegExp(PROPS.locations.join(','), 'i')
    );

    expect(locations).toBeInTheDocument();
  });

  it('renders only three locations if length of locations array is biger than 3', () => {
    render(
      <MemoryRouter>
        <CompanyListingItem {...PROPS} locations={LOCATIONS} />
      </MemoryRouter>
    );

    const allLocations = screen.queryByText(
      new RegExp(LOCATIONS.join(','), 'i')
    );

    expect(allLocations).toBeNull();
  });

  it('renders categories tags', () => {
    render(
      <MemoryRouter>
        <CompanyListingItem {...PROPS} />
      </MemoryRouter>
    );

    const firstCategory = screen.getByText(
      new RegExp(PROPS.categories[0].name, 'i')
    );

    const secondCategory = screen.getByText(
      new RegExp(PROPS.categories[1].name, 'i')
    );

    expect(firstCategory).toBeInTheDocument();
    expect(secondCategory).toBeInTheDocument();
  });

  it('renders first six categories if length of categories array is biger than 6', () => {
    render(
      <MemoryRouter>
        <CompanyListingItem {...PROPS} categories={CATEGORIES} />
      </MemoryRouter>
    );

    const sixthCategory = screen.getByText(new RegExp(CATEGORIES[5].name, 'i'));

    const seventhCategory = screen.queryByText(
      new RegExp(CATEGORIES[6].name, 'i')
    );

    expect(sixthCategory).toBeInTheDocument();
    expect(seventhCategory).toBeNull();
  });
});
