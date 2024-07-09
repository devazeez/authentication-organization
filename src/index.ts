import 'dotenv/config';  // This should be at the very top of your main file
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import winston from "winston";
import expressWinston from "express-winston";
import { AuthRoute, OrganizationRoute } from "./modules";



export const app = express();
const PORT = process.env.PORT || 3000;



// LOGGING
// app.use(
//   expressWinston.logger({
//     transports: [new winston.transports.Console()],
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.simple(),
//     ),
//     meta: true, // log metadata (default: true)
//     msg: "HTTP {{req.method}} {{req.url}}",
//     expressFormat: true,
//     colorize: false, // don't colorize the output
//     requestWhitelist: ["body"], // include request body in the logs
//     responseWhitelist: ["body"], // include response body in the logs
//   }),
// );

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api", AuthRoute);
app.use("/api", OrganizationRoute);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
// })
