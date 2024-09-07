import OAuth2, { OAuth2Namespace } from '@fastify/oauth2';
import fastifyOauth2 from '@fastify/oauth2';
import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import UserRepository from '../../repository/UserRepository';

declare module 'fastify' {
    interface FastifyInstance {
      GoogleOAuth2: OAuth2Namespace;
    }
  }
  
  // Função principal de configuração
  export function googleRouterAuthentication(fastify: FastifyInstance, options: any, done: () => void) {
    const prisma = new PrismaClient();
    const userRepository = new UserRepository(prisma);
  
    // Configura o Google OAuth2
    configureGoogleOAuth2(fastify);
  
    // Configura as rotas de autenticação
    setupAuthRoutes(fastify, userRepository);
  
    done();
  }
  
  // Configuração do Google OAuth2
  function configureGoogleOAuth2(fastify: FastifyInstance) {
    fastify.register(fastifyOauth2, {
      name: 'GoogleOAuth2',
      credentials: {
        client: {
          id: process.env.GOOGLE_CLIENT_ID as string,
          secret: process.env.GOOGLE_CLIENT_KEY as string,
        },
        auth: fastifyOauth2.GOOGLE_CONFIGURATION,
      },
      startRedirectPath: process.env.START_REDIRECT_PATH as string,
      callbackUri: process.env.CALLBACK_URI as string,
      scope: ['profile', 'email'],
    });
  }
  
  // Configura todas as rotas de autenticação
  function setupAuthRoutes(fastify: FastifyInstance, userRepository: UserRepository) {
    // Rota de callback do Google OAuth2
    fastify.get('/auth/google/callback', async function (request, reply) {
      try {
        const { token } = await this.GoogleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
        const user = await userRepository.registerOrLoginUserWithGoogle(token.access_token);
        reply.send({ user, access_token: token.access_token });
      } catch (error) {
        console.error('Erro durante a autenticação do Google:', error);
        reply.status(500).send({ error: 'Erro durante a autenticação do Google' });
      }
    });
  
    // Rota de logout
    fastify.get('/auth/logout', async (request, reply) => {
      try {
        // Lógica de logout (pode ser redefinindo cookies, tokens, etc.)
        reply.send({ message: 'Usuário desconectado com sucesso' });
      } catch (error) {
        console.error('Erro durante o logout:', error);
        reply.status(500).send({ error: 'Erro durante o logout' });
      }
    });
    
  }
  
  // Função auxiliar para obter informações do usuário do Google
  export async function getUserInfoFromGoogle(token: string) {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do usuário do Google:', error);
      throw new Error('Erro ao obter informações do usuário do Google');
    }
  }