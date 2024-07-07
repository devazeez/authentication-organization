const pool = require("../../common/database/db");
import { GenerateSalt, GeneratePassword } from "../../utility";
import { OrganizationService } from "../organization/organization.service";
import {
  // GenerateSalt,
  // GeneratePassword,
  validatePassword,
  generateToken,
} from "../../utility";

const orgService = new OrganizationService();

export class AuthService {
  async validateUserPassword(
    password: string,
    salt: string,
    Existingpassword: string
  ) {
    const validateUserPassword = await validatePassword(
      password,
      salt,
      Existingpassword
    );
    return validateUserPassword;
  }

  async generateUserToken(userId: string, email: string, password: string) {
    const generaterUserToken = generateToken({
        userId,
        email,
        password,
    });
    return generaterUserToken;
  }
}
