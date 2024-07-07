import bcrypt from "bcrypt";
import { Request } from "express";
let joiPasswordComplexity = require("joi-password-complexity");
import jwt from "jsonwebtoken";
import { APP_SECRET, APP_SECRET_TWO } from "../config";
// import { vendorPayload } from '../dto';
import { authPayLoad } from "../modules/authentication/auth.dto";

// Add a custom property to the Request type to avoid TypeScript error
interface CustomRequest extends Request {
  user: authPayLoad;
}

export function passwordComplexity(password: string) {
  let complexPassword = joiPasswordComplexity().validate(password);
  return complexPassword;
}

export const GenerateSalt = async () => {
  console.log("This is salt", bcrypt.genSalt());
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  salt: string,
  savedPassword: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const generateToken = (payload: authPayLoad) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1h" });
};

// export const generateTokenSignUp = (payload: authSignUpPayLoad) => {

//     return jwt.sign(payload, APP_SECRET_TWO, { expiresIn: '1h' })

// }

export const validateToken = async (req: CustomRequest) => {
  const signature = req.get("Authorization");

  if (signature) {
    const payload = (await jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    )) as authPayLoad;
    req.user = payload;

    return true;
  }
  return false;
};
