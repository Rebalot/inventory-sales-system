import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getUserFromCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );

    return {
      email: payload.email,
      role: payload.role,
      id: payload.sub,
    };
  } catch (err) {
    return null;
  }
}