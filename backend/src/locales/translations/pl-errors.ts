/* eslint-disable prettier/prettier */
import { ErrorTranslations } from '../translation.interface';

export const PL_ERRORS: ErrorTranslations = {
  VALIDATION_IS_NUMBER: 'Wprowadzona wartość nie jest cyfrą.',
  VALIDATION_NO_BODY: 'Nie żądanie nie zaiwera żadnych danych.',
  VALIDATION_EMAIL: 'Wprowadź prawidłowy adres E-mail.',
  VALIDATION_EMPTY_PASSWORD: 'Hasło jest wymagane.',
  VALIDATION_FIRST_NAME: 'Imię powinno składać się z 2 do 255 znaków.',
  VALIDATION_LAST_NAME: 'Nazwisko powinno składać się z 2 do 255 znaków.',
  VALIDATION_PASSWORD:
    'Hasło musi składać się minimum z 8 znaków i zawierać małe i duże litery a także cyfrę i znak specjalny.',
  VALIDATION_RESET_TOKEN: 'Token jest wymagany.',
  VALIDATION_COMPANY_DESCRIPTION:
    'Opis powinień składać się minimum z 32 znaków.',
  VALIDATION_COMPANY_NAME: 'Nazwa firmy powinno składać się z 2 do 255 znaków.',
  VALIDATION_COMPANY_PHONE: 'Wprowadź prawidłowy numer telefonu.',
  VALIDATION_COMPANY_SIZE: 'Rozmiar firmy powinien być cyfrą większą od zera.',
  VALIDATION_COMPANY_SLUG:
    "Pole slug powinno składać się z liter i cyfer oddzielonych za pomocą myślników '-'.",
  VALIDATION_COMPANY_SLUG_SIZE: 'Slug powinno składać się z 2 do 255 znaków.',
  VALIDATION_BRANCH_NAME:
    'Nazwa oddziału powinno składać się z 4 do 255 znaków.',
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
  UNAUTHORIZED_INVALID_CREDENTIALS: 'Nieprawidłowe hasło lub adres E-mail.',
  UNAUTHORIZED_INVALID_PASSWORD: 'Podano nieprawidłowe hasło.',
  FORBIDDEN: 'Odmowa dostępu.',
  FORBIDDEN_ACCOUNT_ACTIVATION:
    'Konto zostało już aktywowane lub przesłany token jest nieprawidłowy.',
  FORBIDDEN_INACTIVE_ACCOUNT:
    'Twoje konto nie zostało aktywowane, sprawdź pocztę email.',
  FORBIDDEN_RESET_TOKEN: 'Token resetowania hasła wygasł.',
  FORBIDDEN_ONE_COMPANY_PER_USER: 'To konto posiada już firmowy profil.',
  NOT_FUOND: 'Nie znaleziono zasobu.',
  NOT_FUOND_COMPANY: 'Nie znaleziono firmy.',
  NOT_FUOND_BRANCH: 'Nie znaleziono oddziału firmy.',
  NOT_FUOND_USER: 'Nie znaleziono użytkownika.',
  CONFLICT_EMAIL_TAKEN: 'Podany adres E-mail jest już używany.',
  INTERNAL_SERVER_ERROR: 'Coś poszło nie tak. Spróbuj ponownie później.',
  BAD_GATEWAY_BASE_MESSAGE: '502 Bad Gateway',
  BAD_GATEWAY_EMAIL_DELIVERY:
    'Wysyłanie wiadomości E-mail nie powiodło się.  Spróbuj ponownie później.',
  BAD_GATEWAY_ADDRESS_VALIDATION: 'Błąd podczas walidacji adresu.',
};
