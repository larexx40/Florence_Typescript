//////USER INTERFACE
type userRole = 'Super Admin'| 'Admin' | 'User' | 'Sales Rep' | 'Reseller';
const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "DELETED", "BANNED"] as const;
export interface IUser {
    [x: string]: any;
    name: string;
    username: string;
    email: string;
    phoneno: string;
    password: string;
    dob?: Date;
    address: string;
    balance?: number;
    role: userRole;
    toBalance?: number;
    businessName: string;
    status?: typeof statuses[number];
    email_verified?: boolean;
    verification_token?: number | null | '';
    verification_token_time?: Date | null | '';
    reset_password_token?: string;
    reset_password_token_time?: Date;
    
    // Additional fields can be added as needed
    // ...
}