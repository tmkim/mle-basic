import express from "express";
// import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
// import mongoose from "mongoose";
import "dotenv/config";
// import routes from "./src/routes/index.js";
import { connectToDatabase } from "./src/database";
import { examRouter } from "./src/exam.routes";
import { questionRouter } from "./src/question.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.use("/api/v1", routes);
app.use("/exams", examRouter);
app.use("/questions", questionRouter);

const port = process.env.PORT || 5000;

const server = http.createServer(app);

connectToDatabase(process.env.ATLAS_URI).then(() => {
  console.log("Mongodb connected");
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch((err) => {
  console.log({ err });
  process.exit(1);
});


// import * as dotenv from "dotenv";
// import cors from "cors";
// import express from "express";
// import { connectToDatabase } from "./database";

// // Load environment variables from the .env file, where the ATLAS_URI is configured
// dotenv.config();
 
// const ATLAS_URI = process.env.ATLAS_URI;
 
// if (!ATLAS_URI) {
//    console.error("No ATLAS_URI environment variable has been defined in config.env");
//    process.exit(1);
// }
 
// connectToDatabase(ATLAS_URI)
//    .then(() => {
//        console.log('connecting to ATLAS_URI')
//        const app = express();
//        app.use(cors());
 
//        app.use("/exams", examRouter);
//        app.use("/questions", questionRouter);
        

//        // start the Express server
//        const port = process.env.PORT || 5200;
//        app.listen(port, () => {
//            console.log(`Server running at ${port}...`);
//        });
 
//    })
//    .catch(error => console.error(error));