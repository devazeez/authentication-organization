import express, { Request, Response, NextFunction } from "express";
import {
  createOrg,
  getUserOrganizations,
  getOrganizationById,
  addUserToOrganization,
} from "./organization.controller";
import { authenticate } from "../../middlewares";

const router = express.Router();

router.use(authenticate);

router.post("/organisations", createOrg);
router.get("/organisations", getUserOrganizations);
router.get("/organisations/:orgId", getOrganizationById);
router.post("/organisations/:orgId/users", addUserToOrganization);

export { router as OrganizationRoute };
