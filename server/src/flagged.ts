import * as mongodb from "mongodb";

export interface Flagged {
    _id?: mongodb.ObjectId;
    q_id?: string;
}