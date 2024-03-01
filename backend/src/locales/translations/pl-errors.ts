/* eslint-disable prettier/prettier */
import { ErrorTranslations } from '../translation.interface';

export const PL_ERRORS: ErrorTranslations = {
  VALIDATIO_EMAIL: 'Wprowadź prawidłowy adres E-mail.',
  VALIDATIO_EMPTY_PASSWORD: 'Hasło jest wymagane.',
  VALIDATIO_FIRST_NAME: 'Imię powinno składać się z 2 do 255 znaków.',
  VALIDATIO_LAST_NAME: 'Nazwisko powinno składać się z 2 do 255 znaków.',
  VALIDATIO_PASSWORD:
    'Hasło musi składać się minimum z 8 znaków i zawierać małe i duże litery a także cyfrę i znak specjalny.',
  VALIDATIO_RESET_TOKEN: 'Token jest wymagany.',
  UNAUTHORIZED_INVALID_CREDENTIALS: 'Nieprawidłowe hasło lub adres E-mail.',
  UNAUTHORIZED_INVALID_PASSWORD: 'Podano nieprawidłowe hasło.',
  FORBIDDEN: 'Odmowa dostępu.',
  FORBIDDEN_ACCOUNT_ACTIVATION:
    'Konto zostało już aktywowane lub przesłany token jest nieprawidłowy.',
  FORBIDDEN_INACTIVE_ACCOUNT:
    'Twoje konto nie zostało aktywowane, sprawdź pocztę email.',
  FORBIDDEN_RESET_TOKEN: 'Token resetowania hasła wygasł.',
  NOT_FUOND: 'Nie znaleziono zasobu.',
  NOT_FUOND_USER: 'Nie znaleziono użytkownika.',
  CONFLICT_EMAIL_TAKEN: 'Podany adres E-mail jest już używany.',
  INTERNAL_SERVER_ERROR: 'Coś poszło nie tak. Spróbuj ponownie później.',
  BAD_GATEWAY_BASE_MESSAGE: '502 Bad Gateway',
  BAD_GATEWAY_EMAIL_DELIVERY:
    'Wysyłanie wiadomości E-mail nie powiodło się.  Spróbuj ponownie później.',
};
