import e from "express";
import {
  signIn,
  signUp,
  signOut,
  refreshToken,
} from "../controllers/auth.controller";

const router = e.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);

router.post("/refresh", refreshToken);

export default router;
