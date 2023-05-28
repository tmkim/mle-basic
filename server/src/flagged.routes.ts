import * as express from "express";
import * as mongodb from "mongodb";
import { flaggedColl } from "./database";
 
export const flaggedRouter = express.Router();
flaggedRouter.use(express.json());
 
flaggedRouter.get("/", async (_req, res) => {
   try {
       const employees = await flaggedColl.flagged.find({}).toArray();
       res.status(200).send(employees);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

flaggedRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const flagged = await flaggedColl.flagged.findOne(query);
  
        if (flagged) {
            res.status(200).send(flagged);
        } else {
            res.status(404).send(`Failed to find a flagged: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find a flagged: ID ${req?.params?.id}`);
    }
 });

 flaggedRouter.post("/", async (req, res) => {
    try {
        const flagged = req.body;
        const result = await flaggedColl.flagged.insertOne(flagged);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new flagged: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new flagged.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });

 flaggedRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const flagged = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await flaggedColl.flagged.updateOne(query, { $set: flagged });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated a flagged: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find a flagged: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a flagged: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });
 
 flaggedRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await flaggedColl.flagged.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed a flagged: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a flagged: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a flagged: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });