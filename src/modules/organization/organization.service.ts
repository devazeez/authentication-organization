const pool = require("../../common/database/db");
const queries = require("./organization.queries");
import { GenerateSalt, GeneratePassword } from "../../utility";
import {
  CreateOrgInput,
  OrgResponse,
  addUserToOrgInput,
} from "./organization.dto";
import { userIdDTO } from "../users/users.dto";
import { resolve } from "path";

export class OrganizationService {
  //   async checkNameIsEmpty(name: string): Promise<boolean> {
  //     const result = await new Promise((resolve, reject) => {
  //       pool.query(queries.checkEmailExists, [email], (error: any, results: any) => {
  //         if (error) reject(error);
  //         else resolve(results);
  //       });
  //     }) as any;
  //     return result.rows.length > 0;
  //   }

  async addUserToOrganization(
    organisationId: string,
    newUserId: string
  ): Promise<any> {

    const addUser = await new Promise((resolve, reject) => {
        pool.query(queries.addUserOrgQuery, [organisationId, newUserId], (error: any, result: any) =>{
            if (error) reject (error)
            else resolve(result.rows[0])
        })
    });
    return addUser
  }

  async createOrganization(
    orgData: CreateOrgInput,
    userId: string
  ): Promise<OrgResponse> {
    const { name, description } = orgData;

    const newOrg = (await new Promise((resolve, reject) => {
      pool.query(
        queries.addOrgQuery,
        [name, description, userId],
        (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results.rows[0]);
        }
      );
    })) as any;

    const result = await new Promise((resolve, reject) => {
      pool.query(
        queries.addUserOrgQuery,
        [newOrg.organization_id, newOrg.user_id],
        (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results.rows[0]);
        }
      );
    });

    return {
      orgId: newOrg.organization_id,
      name: newOrg.name,
      description: newOrg.description,
      dateCreated: newOrg.date_created,
    };
  }
}
