import { Router } from "express";
import classroomController from "../controllers/registration.controller";

const routes = () => {
  const router = Router();
  const controller = new classroomController();

  router.get("/", controller.list);
  router.get("/:id", controller.show);
  router.put("/:id", controller.update);
  router.post("/", controller.create);
  router.delete("/:id", controller.delete);

  return router;
};

export default routes;
