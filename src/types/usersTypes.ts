import { Image } from "./meetingTypes";


// Interface para dados de criação de usuário
export interface UserBodyData {
    name: string;
    email: string;
    description: string | null;
    password: string;
    imageProfile?: string | Image[] | undefined;
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
}

// Interface para parâmetros de busca de usuário por email
export interface FindUserByEmailParams {
    email: string;
}