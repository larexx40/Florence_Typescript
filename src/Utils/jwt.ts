import dotenv from 'dotenv';
import jwt,  { SignOptions} from 'jsonwebtoken';
import { AuthTokenPayload } from '../Types/types';
dotenv.config();

export const signJwt = (payload: AuthTokenPayload, options: SignOptions = {} ) => {
    try {
        let {JWT_SECRET, JWT_EXPIRY} = process.env;
        JWT_EXPIRY = (JWT_EXPIRY)? JWT_EXPIRY : 'id';
        if(!JWT_SECRET){
            console.error ("JWT Secret not defined");
            process.exit(1); // Exit the process with an error code
        };
       //expires in 1day
        return jwt.sign(payload, JWT_SECRET!, {
            ...options,
            algorithm: 'HS256',
            expiresIn: JWT_EXPIRY
        }); 
    } catch (error) {
        console.error('Error signing JWT:', error);
        throw new Error('Unable to sign JWT');
    }
    
}


export const verifyJwt = (token: string) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error('Error verifying JWT:', error);
      throw new Error('JWT verification failed');
    }
};
