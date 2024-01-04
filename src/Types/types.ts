export interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export interface AuthTokenPayload {
    exp: any;
    userid: string;
    email: string;
    role: string; 
}

