import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { examRouter } from "./exam.routes";
import { questionRouter } from "./question.routes";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
 
const ATLAS_URI = process.env.ATLAS_URI;
 
if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}
 
connectToDatabase(ATLAS_URI)
   .then(() => {
       console.log('connecting to ATLAS_URI')
       const app = express();
       app.use(cors());
 
       app.use("/exams", examRouter);
       app.use("/questions", questionRouter);
        

       // start the Express server
       const port = process.env.PORT || 5200;
       app.listen(port, () => {
           console.log(`Server running at ${port}...`);
       });
 
   })
   .catch(error => console.error(error));