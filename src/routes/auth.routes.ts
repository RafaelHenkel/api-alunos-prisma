import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const routes = () => {
  const router = Router();
  const controller = new AuthController();

  router.post("/", controller.create);

  return router;
};

export default routes;
