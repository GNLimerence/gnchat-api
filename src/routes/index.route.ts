import e, { Router } from "express";
import authRoute from "./auth.route";

type Route = {
  path: string;
  route: Router;
};

const defaultRoutes: Route[] = [
  {
    path: "/auth",
    route: authRoute,
  },
];

export const router = e.Router();

defaultRoutes.forEach((defaultRoute: Route) => {
  router.use(defaultRoute.path, defaultRoute.route);
});
