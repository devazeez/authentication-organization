import { Request, Response, NextFunction } from "express";
import {
  GenerateSalt,
  GeneratePassword,
  validatePassword,
  generateToken,
} from "../../utility";
import { CreateUserInput, UserLoginInput } from "./users.dto";
import { UserService } from "./users.service";
import { AuthService } from "../authentication/auth.service";
import validate = require('uuid-validate');
const authService = new AuthService();
const userService = new UserService();
const pool = require("../../common/database/db");
const queries = require("./users.queries");

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  pool.query(queries.getUsers, (error: any, results: any) => {
    if (error) throw error;
    return res.status(200).json({
      message: "Users returned successfully",
      data: results.rows,
    });
  });
};

export const getUsersById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId } = req.user;
  console.log(id, userId);
  try {
    if (!id) {
      return res.status(400).json({
        status: "Bad Request",
        message: "User Id cannot be empty",
        statusCode: 400,
      });
    }
    // if (!uuidValidate(id)) {
    //   return res.status(400).json({
    //     status: "Bad Request",
    //     message: "Invalid UUID format for id",
    //     statusCode: 400,
    //   });
    // }

    pool.query(
      queries.getUserById,
      [id, userId],
      (error: any, results: any) => {
        if (error) throw error;
        if (results.rows.length === 0) {
          return res.status(404).json({
            status: "Not Found",
            message: "User not found",
            statusCode: 404,
          });
        }
        const userData = results.rows[0];
        const { date_created, date_deleted, password, salt, ...restOfData } = userData;
        return res.status(200).json({
          status: "success",
          message: "User returned successfully",
          data: {
            userId: restOfData.user_id,
            firstName: restOfData.first_name,
            lastName: restOfData.last_name,
            email: restOfData.email,
            phone: restOfData.phone,
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to get user by Id",
    });
  }
};

export const addUser = (req: Request, res: Response, next: NextFunction) => {
  const { firstname, lastname, email, password, phone } = req.body;
  pool.query(queries.checkEmailExists, [email], (error: any, results: any) => {
    if (results.rows.length) {
      return res.status(422).json({
        message: "Email already exists",
      });
    }

    pool.query(
      queries.addStudent,
      [firstname, lastname, email, password, phone],
      (error: any, results: any) => {
        if (error) throw error;
        return res.status(201).json({
          success: "success",
          message: "User Created successfully",
          data: req.body,
        });
      }
    );
  });
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: CreateUserInput = req.body;

    const emailExists = await userService.checkEmailExists(userData.email);
    if (emailExists) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Registration unsuccessful",
        statusCode: 400,
        // errors: [
        //   {
        //     field: "email",
        //     message: "email already exists",
        //   },
        // ],
      });
    }

    const newUser = await userService.createUser(userData);
    const token = await authService.generateUserToken(
      newUser.userId,
      newUser.email,
      userData.password
    );
    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: newUser,
      },
    });
  } catch (error: any) {
    console.error("Error in signUp:", error);
    return res.status(500).json({
      message: "An error occurred during sign up",
      error: error.message,
    });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <UserLoginInput>req.body;

  try {
    const results = await new Promise<any>((resolve, reject) => {
      pool.query(queries.loginQuery, [email], (error: any, results: any) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    if (!results.rows.length) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const existingUser = results.rows[0];

    const validateUserPassword = await validatePassword(
      password,
      existingUser.salt,
      existingUser.password
    );

    if (validateUserPassword) {
      const accessToken = generateToken({
        userId: existingUser.user_id,
        email: existingUser.email,
        password: existingUser.password,
      });

      // Remove sensitive data before sending
      const { password, salt, ...userDataToSend } = existingUser;

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken,
          user: {
            userId: userDataToSend.user_id,
            firstName: userDataToSend.first_name,
            lastName: userDataToSend.last_name,
            email: userDataToSend.email,
            phone: userDataToSend.phone,
          },
        },
      });
    } else {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }
  } catch (error: any) {
    console.error("Error in user login:", error);
    return res.status(500).json({
      message: "An error occurred during login",
      error: error.message,
    });
  }
};
