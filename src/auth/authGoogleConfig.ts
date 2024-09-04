import OAuth2, { OAuth2Namespace } from '@fastify/oauth2';
import fastifyOauth2 from '@fastify/oauth2';
import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import UserRepository from '../repository/UserRepository';



declare module 'fastify' {
    interface FastifyInstance {
        GoogleOAuth2: OAuth2Namespace;
    }
}

export function googleRouterAuthentication(fastify: FastifyInstance, options: any, done: () => void) {

    const prisma = new PrismaClient
    const userRepository = new UserRepository(prisma)

    fastify.register(fastifyOauth2, {
        name: 'GoogleOAuth2',
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID as string,
                secret: process.env.GOOGLE_CLIENT_KEY as string,
            },
            auth: fastifyOauth2.GOOGLE_CONFIGURATION,
        },
        startRedirectPath: '/auth/google',
        callbackUri: 'http://localhost:3333/auth/google/callback',
        scope: ['profile', 'email'],
    });

    fastify.get('/auth/google/callback', async function (request, reply) {
        try {
            // Obtém o token de acesso do Google
            const { token } = await this.GoogleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

            // Registra ou faz login do usuário no banco de dados usando o token
            const user = await userRepository.registerOrLoginUserWithGoogle(token.access_token);

            reply.send({ user, access_token: token.access_token });
        } catch (error) {
            console.error('Erro durante a autenticação do Google:', error);
            reply.send({ error: 'Erro durante a autenticação do Google' });
        }
    });


    // Chame done no final
    done();
}



export async function getUserInfoFromGoogle(token: string) {
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter informações do usuário do Google:', error);
        throw new Error('Erro ao obter informações do usuário do Google');
    }
}





// Google OAuth2 Options
/* const googleOAuth2Options = {
    // Namespace
    name: 'GoogleOAuth2',
    // Scopes
    scope: ['profile', 'email'],
    credentials: {
        client: {
            id: process.env.GOOGLE_CLIENT_ID as string,
            secret: process.env.GOOGLE_CLIENT_KEY as string,
        },
        // @fastify/oauth2 google provider
        auth: OAuth2.GOOGLE_CONFIGURATION
    },
    // This option will create a new root with the GET method to log in through Google.
    // Make sure you don't have any other routes in this path with the GET method.
    startRedirectPath: '/auth/google',
    callbackUri: 'http://localhost:3333/auth/google/callback',
    // The following 2 functions are check in detail whether the input parameters from Google include the state query parameter or not
    generateStateFunction: (request: FastifyRequest, reply: FastifyReply) => {
        // @ts-ignore
        return request.query.state
    },
    checkStateFunction: (request: FastifyRequest, callback: any) => {
        // @ts-ignore
        if (request.query.state) {
            callback()
            return;
        }
        callback(new Error('Invalid state'))
    }
};

export function registerGoogleOAuth2Provider(fastify: FastifyInstance) {
    fastify.register(OAuth2, googleOAuth2Options)
}

export function googleOAuth2Routes (
    app: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void,
) {
    app.get('auth/google/callback',async function (request: FastifyRequest, reply: FastifyReply) {

        // Get the access token from the Google service and save it into the token value
        const { token } = await app.GoogleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

        // Redirect to our frontend side
        // You can get the access token from the URI Query and save it as a cookie in the client browser
        reply.redirect("http://localhost:3333/?access_token=" + token.access_token);
    });

    done();
} */








