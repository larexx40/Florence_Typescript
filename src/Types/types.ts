export interface EmailOption {
    to: string;
    subject: string;
    text: string;
    html?: string;
}
export interface SMSOption{

}
type userRole = 'Super Admin'| 'Admin' | 'User' | 'Sales Rep' | 'Reseller';
export interface AuthTokenPayload {
    exp: any;
    userid: string;
    email: string;
    role: userRole; 
}

