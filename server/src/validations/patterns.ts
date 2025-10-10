// Whitelist regex patterns for common fields
// Name: letters, spaces, apostrophes, hyphens; 2-50 chars total
export const NAME_REGEX = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;

// Email: basic allowlist pattern; use alongside server-side email parsing as needed
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Password: allow common printable safe characters; 8-64 length
export const PASSWORD_REGEX =
  /^[A-Za-z0-9!@#$%^&*()\-_=+\[\]{};:'",.<>\/?`~|\\]{8,64}$/;
