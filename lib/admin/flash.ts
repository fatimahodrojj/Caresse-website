// Toast messages for actions that redirect to another page (the page they
// were on no longer exists, e.g. after a delete). The action redirects with
// ?flash=<key>; FlashToast in the admin layout shows the message.
export const FLASH_MESSAGES = {
  "request-deleted": "Request deleted permanently.",
  "therapist-created": "Therapist added.",
  "therapist-deleted": "Therapist deleted.",
  "product-created": "Product added.",
  "product-deleted": "Product deleted.",
} as const;

export type FlashKey = keyof typeof FLASH_MESSAGES;

export function withFlash(path: string, key: FlashKey): string {
  return `${path}${path.includes("?") ? "&" : "?"}flash=${key}`;
}
