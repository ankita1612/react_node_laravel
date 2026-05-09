import express from "express";
import { employeeController } from '../controllers/employee.controller'
import { validateAdd, isRequestValidated, validateEdit, validateId } from '../validations/employee.validations'
const employeeRouter = express.Router()
import authentication from "../middleware/auth.middleware"

import {multi_upload} from "../middleware/multiupload.middleware";

employeeRouter.post("/",authentication, multi_upload.fields([
    { name: "single_image", maxCount: 1 },
    { name: "multiple_image", maxCount: 5 },
  ]),
  validateAdd,
  isRequestValidated,
  employeeController.addEmployee
);
employeeRouter.get('/',authentication, employeeController.getEmployees)
employeeRouter.get('/:id',authentication, validateId, employeeController.getEmployee)
employeeRouter.put(
  "/:id",authentication,
  multi_upload.fields([
    { name: "single_image", maxCount: 1 },
    { name: "multiple_image", maxCount: 5 },
  ]),
  validateId,
  validateEdit,
  isRequestValidated,
  employeeController.updateEmployee
);
employeeRouter.get('/static/forgraph',authentication,employeeController.staticResult)
employeeRouter.delete('/:id',authentication,validateId, employeeController.deleteEmployee)
//employeeRouter.deleteImage('/:id',authentication,validateId, employeeController.deleteImage)



export default employeeRouter;