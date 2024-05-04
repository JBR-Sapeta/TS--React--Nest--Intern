export const BRANCH_ONE = {
  name: 'New Company - Kraków',
  address: {
    country: 'Polska',
    region: 'województwo małopolskie',
    postcode: '31-138',
    city: 'Kraków',
    streetName: 'Teofila Lenartowicza',
    houseNumber: '13',
    lat: 50.070053,
    long: 19.927943,
  },
};

export const BRANCH_TWO = {
  name: 'New Company - Gdańsk',
  address: {
    country: 'Polska',
    region: 'województwo pomorskie',
    postcode: '80-704',
    city: 'Gdańsk',
    streetName: 'Teofila Lenartowicza',
    houseNumber: '24',
    lat: 54.35738,
    long: 18.68489,
  },
};

export const BRANCH_THREE = {
  name: 'Old Company - Kraków Centrum',
  address: {
    country: 'Polska',
    region: 'województwo małopolskie',
    postcode: '31-155',
    city: 'Kraków',
    streetName: 'Warszawska',
    houseNumber: '17',
    lat: 50.069694,
    long: 19.943945,
  },
};

export const BRANCH_FOUR = {
  name: 'Old Company - Kraków Rakowice',
  address: {
    country: 'Polska',
    region: 'województwo małopolskie',
    postcode: '31-464',
    city: 'Kraków',
    streetName: 'Widna',
    houseNumber: '40',
    lat: 50.0765256,
    long: 19.9749922181901,
  },
};

export const COMPANY_ONE_BRANCHES = [BRANCH_ONE, BRANCH_TWO];

export const COMPANY_TWO_BRANCHES = [BRANCH_THREE, BRANCH_FOUR];

export const INVALID_BRANCH = {
  name: 'New',
  address: {
    country: '',
    region: 'W',
    postcode: '8',
    city: 'G',
    streetName: 'T',
    houseNumber: '',
    lat: 154.35738,
    long: 195.68489,
  },
};

export const INVALID_BRANCH_ID = 312344;
