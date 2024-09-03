import { OAuth2Client } from 'google-auth-library';

// Configure o cliente OAuth2 com o ID do cliente e o segredo do cliente do Google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function getUserInfoFromGoogle(token: string): Promise<any> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // O mesmo ID de cliente que foi usado para gerar o token
  });

  const payload = ticket.getPayload();
  
  if (!payload) {
    throw new Error('Invalid token');
  }

  // Retorne as informações do usuário
  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    sub: payload.sub, // ID único do usuário do Google
  };
}
