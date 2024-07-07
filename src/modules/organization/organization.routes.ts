import express, { Request, Response, NextFunction } from "express";
import {
  createOrg,
  getUserOrganizations,
  getOrganizationById,
  addUserToOrganization
} from "./organization.controller";
import { authenticate } from "../../middlewares";

const router = express.Router();

router.use(authenticate);

router.post("/organizations", createOrg);
router.get("/organizations", getUserOrganizations);
router.get("/organizations/:orgId", getOrganizationById);
router.post("/organizations/:orgId/users", addUserToOrganization)

export { router as OrganizationRoute };
