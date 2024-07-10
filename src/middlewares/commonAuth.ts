import { Request, Response, NextFunction } from "express";
import { authPayLoad } from "../modules/authentication/auth.dto";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { validateToken } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user: authPayLoad; // Change from 'authPayLoad | undefined' to 'authPayLoad'
      // customer?: authSignUpPayLoad
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the token
    const validate = await validateToken(req);

    if (validate) {
      next(); // Move to the next middleware
    } else {
      // Token is invalid or expired
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      // Token has expired
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    } else {
      // Other errors
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }
  }
};
