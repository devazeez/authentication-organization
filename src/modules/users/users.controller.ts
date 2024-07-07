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
  const id = parseInt(req.params.id);
  pool.query(queries.getUserById, [id], (error: any, results: any) => {
    if (error) throw error;
    return res.status(200).json({
      message: "User returned successfully",
      data: results.rows,
    });
  });
};

export const addUser = (req: Request, res: Response, next: NextFunction) => {
  const { firstname, lastname, email, password, phone } = req.body;
  pool.query(queries.checkEmailExists, [email], (error: any, results: any) => {
    if (results.rows.length) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    pool.query(
      queries.addStudent,
      [firstname, lastname, email, password, phone],
      (error: any, results: any) => {
        if (error) throw error;
        return res.status(201).json({
          message: "User Created successfully",
          data: req.body,
        });
      }
    );
  });

  //   pool.query(queries.getUsers, (error: any, results: any) => {
  //     if (error) throw error;

  //   })
};

// export const signUp = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { firstName, lastName, email, password, phone } = <createUserInput>(
//     req.body
//   );
//   const first_name = firstName;
//   const last_name = lastName;

//   pool.query(
//     queries.checkEmailExists,
//     [email],
//     async (error: any, results: any) => {
//       if (error) {
//         console.error("Error checking email existence:", error);
//         return res.status(500).json({
//           message: "An error occurred during sign up",
//           error: error.message,
//         });
//       }

//       if (results.rows.length) {
//         return res.status(400).json({
//           message: "Email already exists",
//         });
//       }

//       const salt = await GenerateSalt();
//       console.log(salt);
//       const hashedPassword = await GeneratePassword(password, salt);

//       pool.query(
//         queries.addUser,
//         [first_name, last_name, email, hashedPassword, salt, phone],
//         (error: any, results: any) => {
//           if (error) {
//             console.error("Error adding user:", error);
//             return res.status(500).json({
//               message: "An error occurred during sign up",
//               error: error.message,
//             });
//           }
//           return res.status(201).json({
//             message: "User Created successfully",
//             data: results
//           });
//         }
//       );
//     }
//   );
// };

// export const signUp = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { firstName, lastName, email, password, phone } = <createUserInput>(
//     req.body
//   );
//   const first_name = firstName;
//   const last_name = lastName;

//   try {
//     const emailCheckResult = (await new Promise((resolve, reject) => {
//       pool.query(
//         queries.checkEmailExists,
//         [email],
//         (error: any, results: any) => {
//           if (error) reject(error);
//           else resolve(results);
//         }
//       );
//     })) as any;

//     if (emailCheckResult.rows.length) {
//       return res.status(400).json({
//         message: "Email already exists",
//       });
//     }

//     const salt = await GenerateSalt();
//     const hashedPassword = await GeneratePassword(password, salt);

//     const newUser = (await new Promise((resolve, reject) => {
//       pool.query(
//         queries.addUser,
//         [first_name, last_name, email, hashedPassword, salt, phone],
//         (error: any, results: any) => {
//           if (error) reject(error);
//           else resolve(results.rows[0]);
//         }
//       );
//     })) as any;

//     // Transform the data to match your API response format
//     const responseData = {
//       userId: newUser.user_id,
//       firstName: newUser.first_name,
//       lastName: newUser.last_name,
//       email: newUser.email,
//       phone: newUser.phone,
//       dateCreated: newUser.date_created,
//     };

//     return res.status(201).json({
//       status: "success",
//       message: "Registration successful",
//       data: {
//         accessToken: "test",
//         user: responseData,
//       },
//     });
//   } catch (error) {
//     console.error("Error in signUp:", error);
//     return res.status(500).json({
//       message: "An error occurred during sign up",
//       error: error,
//     });
//   }
// };

// userController.ts

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
        message: "Email already exists",
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
      return res.status(400).json({
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
