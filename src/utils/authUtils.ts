import { OAuth2Client } from 'google-auth-library';



/* export async function getUserInfoFromGoogle(token: string): Promise<any> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token payload');
    }

    return {
      email: payload.email ?? '',  // Garantia de string não nula
      name: payload.name ?? '',
      picture: payload.picture ?? '',
      sub: payload.sub ?? '', // ID único do usuário do Google
    };
  } catch (error) {
    throw new Error('Failed to get user info from Google: ');
  }
} */

