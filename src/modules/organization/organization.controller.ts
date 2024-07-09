import { Request, Response, NextFunction, response } from "express";
import { CreateOrgInput } from "./organization.dto";
import { OrganizationService } from "./organization.service";

const orgService = new OrganizationService();
const pool = require("../../common/database/db");
const queries = require("./organization.queries");

export const createOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const orgData: CreateOrgInput = req.body;

    const newOrg = await orgService.createOrganization(orgData, user.userId);

    return res.status(201).json({
      status: "success",
      message: "Organisation created successful",
      data: newOrg,
    });
  } catch (error: any) {
    console.error("Error in creating organization:", error);
    return res.status(500).json({
      message: "An error occurred organisation creation",
      error: error.message,
    });
  }
};

export const getUserOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    console.log(user);
    if (user) {
      const results = (await new Promise<any>((resolve, reject) => {
        pool.query(
          queries.getOrganizations,
          [user.userId],
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      })) as any;
      console.log(results);
      return res.status(200).json({
        message: "User's organisations returned successfully",
        data: {
          organisations: results.rows.map((row: any) => ({
            orgId: row.organization_id,
            name: row.name,
            description: row.description,
          })),
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { orgId } = req.params;

  try {
    const userOrganizations = await new Promise<any>((resolve, reject) => {
      pool.query(
        queries.getOrganizationsByUserIdAndOrgId,
        [user.userId, orgId],
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    if (userOrganizations.rows.length === 0) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    const organizationId = userOrganizations.rows[0].organization_id;

    const organizationDetails = await new Promise<any>((resolve, reject) => {
      pool.query(
        "SELECT name, description FROM organizations WHERE organization_id = $1",
        [organizationId],
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return res.status(200).json({
      status: "success",
      message: "Organisation fetched successfully",
      data: {
        orgId: organizationId,
        name: organizationDetails.rows[0].name,
        description: organizationDetails.rows[0].description,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "An error occurred while fetching organization details",
    });
  }
};

export const addUserToOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserId = req.user.userId;
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organizationResult = await queryDatabase(
      queries.getOrganizationById,
      [orgId, loggedInUserId]
    );

    if (organizationResult.rows.length === 0) {
      return res
        .status(404)
        .json({
          message: "Organisation not found or you don't have access to it",
        });
    }

    const userResult = await queryDatabase(queries.getUserById, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "This user does not exist" });
    }

    const userInOrgResult = await queryDatabase(
      queries.checkUserInOrganization,
      [orgId, userId]
    );

    if (userInOrgResult.rows.length > 0) {
      return res
        .status(400)
        .json({
          message: "This user is already a member of this organisation",
        });
    }

    await orgService.addUserToOrganization(orgId, userId);

    return res
      .status(200)
      .json({
        status: "success",
        message: "User added to organisation successfully",
        // data: organizationResult.rows[0],
      });
  } catch (error) {
    console.error("Error adding user to organization:", error);
    return res
      .status(500)
      .json({
        message: "An error occurred while adding the user to the organisation.",
        error: error,
      });
  }
};

// Helper function to promisify database queries
const queryDatabase = (query: string, params: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error: any, result: any) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
