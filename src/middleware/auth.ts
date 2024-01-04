import dotenv from 'dotenv';
import jwt,  { SignOptions} from 'jsonwebtoken';
const { TokenExpiredError } = jwt;
import { AuthTokenPayload } from '../Types/types';
dotenv.config();

export const checkToken = (req: any, res: any, next: any) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'No token provided' });
    }
    //work if frefix bearer exist or not
    let token : string = req.headers.authorization;
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        //then decode the jwt token
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;    
        // check if token is valid
        if (!decodeToken) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // const expiry = decodeToken.exp;
        console.log(decodeToken);    
        req.user = decodeToken;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ status: false, message: 'Token expired' });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ status: false, message: 'Invalid token error' });
        }
        console.log(error);
        return res.status(500).json({ status: false, message: 'Invalid token' });
        
    }
}

// export const verifyUser = (req: any, res: any, next: any) => {
//     if (!req.headers.authorization) {
//         return res.status(401).json({ error: 'No token provided' });
//     }
//     //work if frefix bearer exist or not
//     let token : string = req.headers.authorization;
//     if (token.startsWith('Bearer ')) {
//         token = token.slice(7, token.length);
//     }
//     //then decode the jwt token
//     const decodeToken = verifyJwt(token);
//     if(decodeToken.role !== 'user') {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }
//     req.user = decodeToken;
//     next();
// }