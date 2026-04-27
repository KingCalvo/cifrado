const enc = new TextEncoder();

async function deriveKeys(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    512, // 64 bytes = 2 claves
  );

  const bytes = new Uint8Array(bits);

  const aesKeyBytes = bytes.slice(0, 32); // AES
  const hmacKeyBytes = bytes.slice(32, 64); // HMAC

  const aesKey = await crypto.subtle.importKey(
    "raw",
    aesKeyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );

  const hmacKey = await crypto.subtle.importKey(
    "raw",
    hmacKeyBytes,
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign", "verify"],
  );

  return { aesKey, hmacKey };
}

// Cifrar
export async function encryptFile(data, password) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const { aesKey } = await deriveKeys(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    data,
  );

  return {
    encrypted: new Uint8Array(encrypted),
    iv,
    salt,
  };
}

// Descrifar
export async function decryptFile(encrypted, password, iv, salt) {
  const { aesKey } = await deriveKeys(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encrypted,
  );

  return new Uint8Array(decrypted);
}

// HMAC
export async function generateHMAC(data, password, salt) {
  const { hmacKey } = await deriveKeys(password, salt);

  const signature = await crypto.subtle.sign("HMAC", hmacKey, data);

  return new Uint8Array(signature);
}

export async function verifyHMAC(data, password, salt, hmac) {
  const { hmacKey } = await deriveKeys(password, salt);

  return crypto.subtle.verify("HMAC", hmacKey, hmac, data);
}

export async function hashSHA256(data) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
