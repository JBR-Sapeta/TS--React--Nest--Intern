export function convertBase64ToUtf8(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
}
