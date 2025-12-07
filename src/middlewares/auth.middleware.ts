import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserType } from "../models/User";
import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/response";

interface AdditionalTypeJwtPayload extends JwtPayload {
  userId: string;
}

export interface AdditionalRequest extends Request {
  user: UserType;
}

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(fail("Can not find access token", "UNAUTHORIZED"));
    }

    if (process.env.JWT_SECRET) {
      jwt.verify(token, process.env.JWT_SECRET, async (error, decodedUser) => {
        if (error) {
          console.error(error);

          return res
            .status(403)
            .json(
              fail("Access token is expired or not verified", "UNAUTHORIZED")
            );
        }

        const user = await User.findById(
          (decodedUser as AdditionalTypeJwtPayload)?.userId
        ).select("-hashedPassword");

        if (!user) {
          return res
            .status(404)
            .json(fail("User is not existed!", "NOT_FOUND"));
        }

        (req as AdditionalRequest).user = user;
        next();
      });
    }
  } catch (error) {
    console.error("Error when trying to confirm JWT", error);
    return res.status(500).json(fail("Internal server error"));
  }
};
