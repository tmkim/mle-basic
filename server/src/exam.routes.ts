import * as express from "express";
import * as mongodb from "mongodb";
import { examColl } from "./database";
 
export const examRouter = express.Router();
examRouter.use(express.json());
 
examRouter.get("/", async (_req, res) => {
   try {
       const employees = await examColl.exams.find({}).toArray();
       res.status(200).send(employees);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

examRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const exam = await examColl.exams.findOne(query);
  
        if (exam) {
            res.status(200).send(exam);
        } else {
            res.status(404).send(`Failed to find an exam: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find an exam: ID ${req?.params?.id}`);
    }
 });

 examRouter.post("/", async (req, res) => {
    try {
        const exam = req.body;
        const result = await examColl.exams.insertOne(exam);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new exam: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new exam.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });

 examRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const exam = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await examColl.exams.updateOne(query, { $set: exam });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an exam: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an exam: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an exam: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });
 
 examRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await examColl.exams.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an exam: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an exam: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an exam: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });

 