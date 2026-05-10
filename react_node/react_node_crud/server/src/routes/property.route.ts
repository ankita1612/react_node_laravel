import express from "express";
import { propertyController } from '../controllers/property.controller'
import { validateAdd, isRequestValidated, validateEdit, validateId } from '../validations/property.validations'
const propertyRouter = express.Router()

import {multi_upload} from "../middleware/multiupload.middleware";

propertyRouter.post("/", multi_upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
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
    { name: "profile_image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  validateId,
  validateEdit,
  isRequestValidated,
  propertyController.updateProperty
);
propertyRouter.delete('/:id',validateId, propertyController.deleteProperty)
export default propertyRouter;