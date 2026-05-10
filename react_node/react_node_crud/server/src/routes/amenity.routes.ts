import express from "express";
import { amenityController } from "../controllers/amenity.controller";

const amenityRouter = express.Router();

amenityRouter.get(
  "/",
  amenityController.getAmenities,
);

amenityRouter.get(
  "/seed",
  amenityController.seedAmenities,
);

export default amenityRouter;