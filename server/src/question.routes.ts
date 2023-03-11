import * as express from "express";
import * as mongodb from "mongodb";
import { questionColl } from "./database";
 
export const questionRouter = express.Router();
questionRouter.use(express.json());
 
questionRouter.get("/", async (_req, res) => {
   try {
       const employees = await questionColl.questions.find({}).toArray();
       res.status(200).send(employees);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

questionRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const question = await questionColl.questions.findOne(query);
  
        if (question) {
            res.status(200).send(question);
        } else {
            res.status(404).send(`Failed to find a question: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find a question: ID ${req?.params?.id}`);
    }
 });

 questionRouter.post("/", async (req, res) => {
    try {
        const question = req.body;
        const result = await questionColl.questions.insertOne(question);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new question: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new question.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });

 questionRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const question = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await questionColl.questions.updateOne(query, { $set: question });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated a question: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find a question: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a question: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });
 
 questionRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await questionColl.questions.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed a question: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a question: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a question: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });