import { Image } from "./meetingTypes";


export interface CreateUserData {
    name: string, 
    email: string, 
    description: string | null,
    password: string,
    imageProfile?: string | Image[] | undefined;
}

export interface UserParams {
    userId: string
}