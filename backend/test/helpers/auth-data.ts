export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
export const RANDOM_UUID = '9f873987-49d6-4fae-afbf-900d4ca4ed24';
export const INVALID_REFRESH_TOKEN =
  'XDeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNWM4ZDUwYy1hMGUwLTRmODEtOWNjMy0yNjg5M2UwMTM0MDkiLCJpYXQiOjE3MDg2MjcxOTcsImV4cCI6MTcwODcxMzU5N30.l70_IzlWUQ93wYZvwayEX4Fv8n_vSMP6vgfKDyYsVYI';
export const INVALID_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNWM4ZDUwYy1hMGUwLTRmODEtOWNjMy0yNjg5M2UwMTM0MDkiLCJpYXQiOjE3MDg2Mjc1ODEsImV4cCI6MTcwODYyODE4MX0.oL9ovmt4OQcuxVn46r_7_d1a2eF-Y7NVzl35p2ZCoyQ';

export const VALID_SIGN_UP_DATA: User = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@mail.com',
  password: 'Password123#',
};

export const INVALID_SIGN_UP_DATA: User = {
  firstName: 'J',
  lastName: 'D',
  email: 'usermail.com',
  password: 'Password',
};

export const USER_ONE: User = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@mail.com',
  password: 'Password123#',
};

export const USER_TWO: User = {
  firstName: 'Tom',
  lastName: 'Davids',
  email: 'user1@mail.com',
  password: 'Password123$',
};

export const USER_ONE_CREDENTIALS: Credentials = {
  email: 'user@mail.com',
  password: 'Password123#',
};

export const USER_TWO_CREDENTIALS: Credentials = {
  email: 'user1@mail.com',
  password: 'Password123$',
};
