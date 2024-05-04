export const OFFER_ONE = {
  title: 'Staż w księgowości.',
  position: 'Młodszy Księgowy',
  description:
    'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.',
  isPaid: true,
  isActive: true,
  expirationTime: 28,
  employmentType: 1,
  operatingMode: 1,
  branches: [312344],
  categories: [4, 31, 32, 33],
};

export const OFFER_TWO = {
  title: 'Praktyki w dziale administracji.',
  position: 'Praktykant w dziale administracji',
  description:
    'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.',
  isPaid: true,
  isActive: true,
  expirationTime: 28,
  employmentType: 2,
  operatingMode: 1,
  branches: [312344],
  categories: [1, 17, 19],
};

export const OFFER_THREE = {
  title: 'Praktyki w księgowości.',
  position: 'Młodszy Księgowy',
  description:
    'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.',
  isPaid: false,
  isActive: true,
  expirationTime: 28,
  employmentType: 2,
  operatingMode: 1,
  branches: [312344],
  categories: [4, 31, 32, 33],
};

export const OFFER_FOUR = {
  title: 'Praktyki w dziale administracji.',
  position: 'Praktykant w dziale administracji',
  description:
    'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.',
  isPaid: false,
  isActive: true,
  expirationTime: 28,
  employmentType: 2,
  operatingMode: 1,
  branches: [312344],
  categories: [1, 17, 19],
};

export const COMPANY_ONE_OFFERS = [OFFER_ONE, OFFER_TWO];
export const COMPANY_TWO_OFFERS = [OFFER_THREE, OFFER_FOUR];

export const INVALID_OFFER = {
  title: 'P.',
  position: 'P',
  description: 'The.',
  isPaid: 'false',
  isActive: 'true',
  expirationTime: 100,
  employmentType: 100,
  operatingMode: 100,
  branches: '[312344]',
  categories: '[1000, 2000]',
};

export const INVALID_OFFER_ID = 312344;
