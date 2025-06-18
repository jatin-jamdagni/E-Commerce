import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { prisma } from "@eshop/libs";
import { AuthenticationError } from "@eshop/error-middleware"; // Assuming you have this custom error class




export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    let token: string | undefined;

    // Check for token in cookies first, then in Authorization header
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AuthenticationError("Unauthorized! Token missing."));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string; role: 'user' | 'seller' };

    // Find the user based on the decoded ID
    const account = await prisma.users.findUnique({
      where: { id: decoded.id },

    });

    if (!account) {
      return next(new AuthenticationError("Unauthorized! Account not found for this token."));
    }
    (req as any).user = account;

    return next();

  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(new AuthenticationError("Unauthorized! Token expired."));
    } else if (err instanceof JsonWebTokenError) {
      return next(new AuthenticationError("Unauthorized! Invalid token."));
    } else {
      console.error("Authentication error: ", err);
      return next(new AuthenticationError("Unauthorized! An unexpected error occurred."));
    }
  }
};


