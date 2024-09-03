
import { FastifyInstance } from 'fastify';
import fastifyOauth2, { FastifyOAuth2Options } from '@fastify/oauth2';

// Função para registrar a autenticação do Google
export const registerGoogleAuth = (fastify: FastifyInstance) => {
    fastify.register<FastifyOAuth2Options>(fastifyOauth2, {
        name: 'googleOAuth2',
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID!,
                secret: process.env.GOOGLE_CLIENT_SECRET!,
            },
            auth: fastifyOauth2.GOOGLE_CONFIGURATION,
        },
        startRedirectPath: '/auth/google',
        callbackUri: 'http://localhost:3333/auth/google/callback',
    });
};
