import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types';

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const options: SignOptions = {
    expiresIn: '7d',
  };
  
  return jwt.sign(payload as object, secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.verify(token, secret) as JWTPayload;
};
