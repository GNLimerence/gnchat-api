import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { created, fail, ok } from "../utils/response";
import crypto from "crypto";
import Session from "../models/Session";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res
        .status(400)
        .json(fail("Please provide required attributes", "BAD_REQUESTS"));
    }

    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res
        .status(409)
        .json(fail("Username is already existed", "ALREADY_EXISTS"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    return res.status(200).json(created("Account created successfully!"));
  } catch (error) {
    console.error("Sign up failed", error);
    return res.status(500).json(fail("Internal Error"));
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json(fail("Please provide required attributes", "BAD_REQUESTS"));
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json(fail("Username or password is not correct", "UNAUTHOURIZED"));
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json(fail("Username or password is not correct", "UNAUTHOURIZED"));
    }

    if (process.env.JWT_SECRET) {
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: ACCESS_TOKEN_TTL,
        }
      );
      const refreshToken = crypto.randomBytes(64).toString("hex");

      await Session.create({
        userId: user._id,
        refreshToken,
        expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: REFRESH_TOKEN_TTL,
      });

      return res
        .status(200)
        .json(
          ok<{ accessToken: string }>({ accessToken }, "Login Successfully!")
        );
    } else {
      throw new Error();
    }
  } catch (error) {
    console.error("Sign in failed", error);
    return res.status(500).json(fail("Internal Error"));
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await Session.deleteOne({ refreshToken: token });

      res.clearCookie("refreshToken");
    }

    return res.status(200).json(created("Logout Successfully!"));
  } catch (error) {
    console.error("Sign in failed", error);
    return res.status(500).json(fail("Internal Error"));
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json(fail("Token not found"));
    }

    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res.status(403).json(fail("Token is expired"));
    }

    if (session.expiredAt < new Date()) {
      return res.status(403).json(fail("Token is expired"));
    }

    if (process.env.JWT_SECRET) {
      const accessToken = jwt.sign(
        {
          userId: session.userId,
        },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_TTL }
      );

      return res
        .status(200)
        .json(ok<{ accessToken: string }>({ accessToken }, "Success"));
    }
  } catch (error) {
    console.error("Error when call refreshToken", error);
    return res.status(500).json(fail("Internal server error"));
  }
};
