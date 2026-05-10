import express from "express";
import { ownerController } from "../controllers/owner.controller";

const ownerRouter = express.Router();

ownerRouter.get(
  "/",
  ownerController.getOwners,
);

ownerRouter.get(
  "/seed",
  ownerController.seedOwners,
);

export default ownerRouter;