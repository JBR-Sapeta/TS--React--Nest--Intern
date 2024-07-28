export function convertStringToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}
