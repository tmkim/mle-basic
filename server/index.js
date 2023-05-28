import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";
import { connectToDatabase } from "./src/database";
import { examRouter } from "./src/exam.routes";
import { questionRouter } from "./src/question.routes";
import { flaggedRouter } from "./src/flagged.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.use("/api/v1", routes);
app.use("/exams", examRouter);
app.use("/questions", questionRouter);
app.use("/flagged", flaggedRouter);

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