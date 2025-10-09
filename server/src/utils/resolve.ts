import fs from "fs";

export function resolveFirstExisting(
  candidates: Array<string | undefined>
): string {
  for (const p of candidates) {
    if (!p) continue;
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore and try next
    }
  }
  const tried = candidates.filter(Boolean).join(", ");
  throw new Error(`No valid file found. Tried: ${tried}`);
}

export const keyPath = resolveFirstExisting([
  process.env.SSL_KEY_PATH,
  "keys/privateKey.pem",
  "keys/privatekey.pem",
]);
export const certPath = resolveFirstExisting([
  process.env.SSL_CERT_PATH,
  "keys/certificate.pem",
  "keys/certifecate.pem",
]);
