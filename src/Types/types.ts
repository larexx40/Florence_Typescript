export interface EmailOption {
    from?: string
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export interface EmailWithTemplate extends EmailOption {
    template: string;
    context?: { [key: string]: any };
}
export interface SMSOption{

}
type userRole = 'Super Admin'| 'Admin' | 'User' | 'Sales Rep' | 'Reseller';
export interface AuthTokenPayload {
    userid: string;
    email: string;
    role: userRole; 
}



