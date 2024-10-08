import { Image } from "./meetingTypes";


// Interface para dados de criação de usuário
export interface UserBodyData {
    name: string;
    email: string;
    description: string | null;
    password?: string | null;
    imageProfile?: string | Image[] | undefined;
    googleId?: string;
}

export interface AuthenticateUserData {
    email: string;
    password: string;
}

// Interface para parâmetros de usuário
export interface UserParams {
    userId: string;
}

// Interface para parâmetros de busca de usuário por nome
export interface FindUserByNameParams {
    name: string;
}

// Interface para parâmetros de busca de usuário por ID
export interface FindUserByIdParams {
    id: string;
    name: string;
    email: string;
    emailConfirmed: boolean;
    imageProfile: string | null,
}

// Interface para parâmetros de busca de usuário por email
export interface FindUserByEmailParams {
    email: string;
}

export interface UserProfile {
    name: string;
    description: string | null;
    imageProfile: string | null;

}
