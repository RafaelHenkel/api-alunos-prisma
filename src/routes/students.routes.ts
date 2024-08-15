import { Router } from "express";
import StudentController from "../controllers/student.controller";
import authMiddleware from "../middlewares/auth.middleware";

const routes = () => {
  const router = Router();
  const controller = new StudentController();

  router.get("/", authMiddleware, controller.list);
  router.get("/:id", authMiddleware, controller.show);
  router.put("/:id", authMiddleware, controller.update);
  router.post("/", authMiddleware, controller.create);
  router.delete("/:id", authMiddleware, controller.delete);

  return router;
};

export default routes;
