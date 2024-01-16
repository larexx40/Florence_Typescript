import dotenv from 'dotenv';
import jwt,  { SignOptions} from 'jsonwebtoken';
dotenv.config();

export const signJwt = (payload: any, expiry: string = '1d', options: SignOptions = {} ) => {
    try {
        const {JWT_SECRET} = process.env;
        if(!JWT_SECRET){
            console.error ("JWT Secret Undefined");
            process.exit(1); // Exit the process with an error code
        };
       //expires in 1day
        return jwt.sign(payload, JWT_SECRET!, {
            ...options,
            algorithm: 'HS256',
            expiresIn: expiry
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
