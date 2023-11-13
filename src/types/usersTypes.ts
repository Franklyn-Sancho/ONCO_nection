import { Image } from "./meetingTypes";


export interface CreateUserData {
    name: string, 
    email: string, 
    password: string,
    image?: string | Image[] | undefined;
}

export interface UserParams {
    userId: string
}