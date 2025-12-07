import e, { RequestHandler, Router } from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import { protectedRoute } from "../middlewares/auth.middleware";

type Route = {
  path: string;
  route: Router;
  middleware?: RequestHandler | RequestHandler[];
};

const defaultRoutes: Route[] = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
    middleware: protectedRoute,
  },
];

export const router = e.Router();

defaultRoutes.forEach((defaultRoute: Route) => {
  if (defaultRoute.middleware) {
    router.use(defaultRoute.path, defaultRoute.middleware, defaultRoute.route);
  } else {
    router.use(defaultRoute.path, defaultRoute.route);
  }
});
