import { Request, Response } from "express";
import { fail, ok } from "../utils/response";
import { AdditionalRequest } from "../middlewares/auth.middleware";
import { UserType } from "../models/User";

export const authMe = async (req: Request, res: Response) => {
  try {
    const user = (req as AdditionalRequest).user;

    return res
      .status(200)
      .json(ok<UserType>(user, "This is your information ;)"));
  } catch (error) {
    console.error("Error authMe", error);
    return res.status(500).json(fail("Internal server error"));
  }
};

export const test = async (req: Request, res: Response) => {
  return res.send({ message: "hello" });
};
