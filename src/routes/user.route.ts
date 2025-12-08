import e from "express";
import { authMe, test } from "../controllers/user.controller";

const router = e.Router();

router.get("/me", authMe);

router.get("/test", test);

export default router;
