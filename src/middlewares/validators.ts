import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// validation rules
const userValidationRules = () => {
  return [
    body("firstName").isString().withMessage("First name must be a string"),
    body("lastName").isString().withMessage("Last name must be a string"),
    body("email").isEmail().withMessage("Email must be valid"),
    // body("phone").isString().withMessage("phone number must be a string"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
    // body('phone').optional().isString().withMessage('Phone must be a string'),
    // body("phone")
    //   .isLength({ min: 10, max: 11 })
    //   .withMessage(
    //     "Phone must be at least 6 characters long and not more than 11"
    //   ),
  ];
};

// Validate middleware
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Extract the relevant information from each error
  const extractedErrors: { field: string; message: string }[] = errors
    .array()
    .map((err) => ({
      field: (err as any).path,
      message: err.msg,
    }));

  return res.status(422).json({
    // status: "Bad request",
    // message: "Registration unsuccessful",
    // statusCode: 422,
    errors: extractedErrors,
  });
};

export { userValidationRules, validate };
