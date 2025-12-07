import e from "express";
import { authMe } from "../controllers/user.controller";

const router = e.Router();

router.get("/me", authMe);

export default router;
