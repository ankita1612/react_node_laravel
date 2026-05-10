import express from "express";
import { propertyController } from '../controllers/property.controller'
import { validateAdd, isRequestValidated, validateEdit, validateId } from '../validations/property.validations'
const propertyRouter = express.Router()

import {multi_upload} from "../middleware/multiupload.middleware";

propertyRouter.post(
  "/",
  multi_upload.fields([
    { name: "brochure", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  validateAdd,
  isRequestValidated,
  propertyController.addProperty
);
propertyRouter.get('/', propertyController.getProperties)
propertyRouter.get('/:id', validateId, propertyController.getProperty)
propertyRouter.put(
  "/:id",
  multi_upload.fields([
    { name: "brochure", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  validateId,
  validateEdit,
  isRequestValidated,
  propertyController.updateProperty
);
propertyRouter.delete('/:id',validateId, propertyController.deleteProperty)
export default propertyRouter;