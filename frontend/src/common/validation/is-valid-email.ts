export function isValidEmail(email: string): string {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email) ? '' : 'Wprowadź prawidłowy adres email.';
}
