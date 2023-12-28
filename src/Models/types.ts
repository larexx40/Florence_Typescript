//////USER INTERFACE
type userRole = 'Super Admin'| 'Admin' | 'User' | 'Sales Rep' | 'Reseller';
const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "DELETED", "BANNED"] as const;
export interface IUser {
    username: string;
    email: string;
    phoneno: string;
    password: string;
    dob?: Date;
    address: string;
    balance: number;
    role?: userRole;
    toBalance: number;
    businessName: string;
    status?: typeof statuses[number];
    // Additional fields can be added as needed
    // ...
}