import express, { Request, Response, NextFunction } from "express";
import { getUsers, getUsersById, addUser, signUp, userLogin } from "./users.controller";
import { userValidationRules, validate } from '../../middlewares';

const router = express.Router();

// router.use(authorize, authenticate);

router.get("/users", getUsers);
router.get("/users/:id", getUsersById);
router.post("/users", addUser);
router.post("/auth/register", userValidationRules(), validate, signUp);
router.post("/auth/login", userLogin);



// router.get ("/", (req, res) =>{
//     return res.status(200).json({
//         message:"Testing this route"
//     })
// })

export { router as AuthRoute };
