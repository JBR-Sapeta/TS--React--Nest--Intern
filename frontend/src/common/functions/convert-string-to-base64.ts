export function convertStringToBase64(str: string) {
  return btoa(unescape(encodeURIComponent(str)));
}
