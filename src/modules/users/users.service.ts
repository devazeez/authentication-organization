const pool = require("../../common/database/db");
const queries = require("./users.queries");
import { GenerateSalt, GeneratePassword } from "../../utility";
import { CreateUserInput, UserResponse } from "./users.dto";
import { OrganizationService } from "../organization/organization.service";


const orgService = new OrganizationService();

export class UserService {
  async checkEmailExists(email: string): Promise<boolean> {
    const result = (await new Promise((resolve, reject) => {
      pool.query(
        queries.checkEmailExists,
        [email],
        (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results);
        }
      );
    })) as any;
    return result.rows.length > 0;
  }

  async createUser(userData: CreateUserInput): Promise<UserResponse> {
    const { firstName, lastName, email, password, phone } = userData;
    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    const newUser = (await new Promise((resolve, reject) => {
      pool.query(
        queries.addUser,
        [firstName, lastName, email, hashedPassword, salt, phone],
        (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results.rows[0]);
        }
      );
    })) as any;

    const orgData = {
      name: newUser.first_name + "'s " + "Organization",
      description: " ",
    };
    orgService.createOrganization(orgData, newUser.user_id);

    return {
      userId: newUser.user_id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
      phone: newUser.phone,
      //   dateCreated: newUser.date_created,
    };
  }
}
