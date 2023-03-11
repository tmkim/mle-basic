import * as express from "express";
import * as mongodb from "mongodb";
import { userColl } from "./database";
 
export const userRouter = express.Router();
userRouter.use(express.json());
 
userRouter.get("/", async (_req, res) => {
   try {
       const employees = await userColl.users.find({}).toArray();
       res.status(200).send(employees);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

userRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const user = await userColl.users.findOne(query);
  
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(`Failed to find a user: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find a user: ID ${req?.params?.id}`);
    }
 });

 userRouter.post("/", async (req, res) => {
    try {
        const user = req.body;
        const result = await userColl.users.insertOne(user);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new user: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });

 userRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const user = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await userColl.users.updateOne(query, { $set: user });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated a user: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find a user: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a user: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });

 userRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await userColl.users.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed a user: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a user: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a user: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });