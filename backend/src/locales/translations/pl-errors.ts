/* eslint-disable prettier/prettier */

import { ErrorTranslations } from '../translation.interface';

export const PL_ERRORS: ErrorTranslations = {
  VALIDATION_ADDRESS_DEFINED:
    'Wprowadź adres zawierający wszytskie wymagane pola.',
  VALIDATION_ADDRESS_COUNTRY: 'Nazwa kraju nie może być pusta.',
  VALIDATION_ADDRESS_REGION:
    'Nazwa regionu powinna składać się z 2 do 64 znaków.',
  VALIDATION_ADDRESS_POSTCODE:
    'Kod pocztowy powinien składać się z 2 do 32 znaków.',
  VALIDATION_ADDRESS_CITY: 'Nazwa miatsa powinna składać się z 2 do 64 znaków.',
  VALIDATION_ADDRESS_STREET:
    'Nazwa ulicy powinna składać się z 2 do 64 znaków.',
  VALIDATION_ADDRESS_HOUSE_NUMBER:
    'Number budynku powinnien składać się minimum z 1 do 16 znaków.',
  VALIDATION_ADDRESS_LATITUDE:
    'Nieprawidłowa wartość szerokości geograficznej.',
  VALIDATION_ADDRESS_LONGITUDE: 'Nieprawidłowa wartość długości geograficznej.',
  VALIDATION_ADDRESS_CHECK:
    'Nie udało się nam zweryfikować wprowadzonego adresu.',
  VALIDATION_AUTH_FIRST_NAME: 'Imię powinno składać się z 2 do 255 znaków.',
  VALIDATION_AUTH_LAST_NAME: 'Nazwisko powinno składać się z 2 do 255 znaków.',
  VALIDATION_AUTH_PASSWORD:
    'Hasło musi składać się minimum z 8 znaków i zawierać małe i duże litery a także cyfrę i znak specjalny.',
  VALIDATION_AUTH_RESET_TOKEN: 'Token jest wymagany.',
  VALIDATION_BRANCH_NAME:
    'Nazwa oddziału powinno składać się z 4 do 255 znaków.',
  VALIDATION_COMMON_EMAIL: 'Wprowadź prawidłowy adres E-mail.',
  VALIDATION_COMMON_EMPTY_PASSWORD: 'Hasło jest wymagane.',
  VALIDATION_COMMON_LIMIT: 'Wprowadź liczbę całkowitą z przedziałuod 1 do 100.',
  VALIDATION_COMMON_PAGE_NUMBER: 'Wprowadź dodatnią liczbę całkowitą.',
  VALIDATION_COMMON_RANGE: 'Wprowadź liczbę całkowitą z przedziałuod 1 do 100.',
  VALIDATION_COMMON_IS_NUMBER: 'Wprowadzona wartość nie jest cyfrą.',
  VALIDATION_COMMON_NO_BODY: 'Nie żądanie nie zaiwera żadnych danych.',
  VALIDATION_COMPANY_DESCRIPTION:
    'Opis powinień składać się minimum z 32 znaków.',
  VALIDATION_COMPANY_NAME: 'Nazwa firmy powinno składać się z 2 do 255 znaków.',
  VALIDATION_COMPANY_PHONE: 'Wprowadź prawidłowy numer telefonu.',
  VALIDATION_COMPANY_SIZE: 'Rozmiar firmy powinien być cyfrą większą od zera.',
  VALIDATION_COMPANY_SLUG:
    "Pole slug powinno składać się z liter i cyfer oddzielonych za pomocą myślników '-'.",
  VALIDATION_COMPANY_SLUG_SIZE: 'Slug powinno składać się z 2 do 255 znaków.',
  VALIDATION_OFFER_BRANCHES:
    'Nieprawidłowa wartość. Wymagana tablica liczb całkowitych.',
  VALIDATION_OFFER_CATEGORIES:
    'Nieprawidłowa wartość. Wymagana tablica liczb całkowitych.',
  VALIDATION_OFFER_DESCRIPTION:
    'Opis ogłoszenia powinien składać się z 24 do 3072 znaków.',
  VALIDATION_OFFER_EMPLOYMENT_TYPE:
    'Nieprawidłowa wartość. Wprowadź liczbę całkowitą z przedziałuod 1 do 5.',
  VALIDATION_OFFER_EXPIRATION_TIME:
    'Wartość pola powinna być liczbą całkowitą z przedziału od 7 do 42.',
  VALIDATION_OFFER_IS_PAID:
    'Nieprawidłowa wartość. Wprowadź wartośc typu boolean.',
  VALIDATION_OFFER_IS_ACTIVE:
    'Nieprawidłowa wartość.Wprowadź wartośc typu boolean.',
  VALIDATION_OFFER_POSITION:
    'Nazwa stanowiska powinna składać się z 2 do 64 znaków.',
  VALIDATION_OFFER_OPERATING_MODE:
    'Nieprawidłowa wartość. Wprowadź liczbę całkowitą z przedziałuod 1 do 3.',
  VALIDATION_OFFER_TITLE:
    'Tytuł ogłoszenia powinien składać się z 4 do 64 znaków.',
  UNAUTHORIZED_INVALID_CREDENTIALS: 'Nieprawidłowe hasło lub adres E-mail.',
  UNAUTHORIZED_INVALID_PASSWORD: 'Podano nieprawidłowe hasło.',
  FORBIDDEN: 'Odmowa dostępu.',
  FORBIDDEN_ACCOUNT_ACTIVATION:
    'Konto zostało już aktywowane lub przesłany token jest nieprawidłowy.',
  FORBIDDEN_INACTIVE_ACCOUNT:
    'Twoje konto nie zostało aktywowane, sprawdź pocztę email.',
  FORBIDDEN_ONE_COMPANY_PER_USER: 'To konto posiada już firmowy profil.',
  FORBIDDEN_RESET_TOKEN: 'Token resetowania hasła wygasł.',
  NOT_FUOND: 'Nie znaleziono zasobu.',
  NOT_FUOND_BRANCH: 'Nie znaleziono oddziału firmy.',
  NOT_FUOND_BRANCHES: 'Nie znaleziono oddziałów firmy.',
  NOT_FUOND_CATEGORIES: 'Nie znaleziono kategorii.',
  NOT_FUOND_COMPANY: 'Nie znaleziono firmy.',
  NOT_FUOND_EMPLOYMENT_TYPE: 'Nie znaleziono typu zatrudnienia',
  NOT_FUOND_OFFER: 'Nie znaleziono ogłoszenia.',
  NOT_FUOND_OPERATING_MODE: 'Nie znaleziono trybu pracy.',
  NOT_FUOND_USER: 'Nie znaleziono użytkownika.',
  CONFLICT_EMAIL_TAKEN: 'Podany adres E-mail jest już używany.',
  INTERNAL_SERVER_ERROR: 'Coś poszło nie tak. Spróbuj ponownie później.',
  BAD_GATEWAY_BASE_MESSAGE: '502 Bad Gateway',
  BAD_GATEWAY_EMAIL_DELIVERY:
    'Wysyłanie wiadomości E-mail nie powiodło się.  Spróbuj ponownie później.',
  BAD_GATEWAY_ADDRESS_VALIDATION: 'Błąd podczas walidacji adresu.',
};
