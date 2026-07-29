import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET ?? "dev-only-secret";
const encodedKey = new TextEncoder().encode(secretKey);
const COOKIE_NAME = "albimaq_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  return decrypt(cookie);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
