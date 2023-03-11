import * as mongodb from "mongodb";
import { Question } from "./question";
import { Exam } from "./exam";

export const examColl:{
    exams?: mongodb.Collection<Exam>;
} = {};

export const questionColl:{
    questions?: mongodb.Collection<Question>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("twmle");
    await applySchemaValidation(db);

    const examsCollection = db.collection<Exam>("exams");
    examColl.exams = examsCollection;

    const questionsCollection = db.collection<Question>("questions");
    questionColl.questions = questionsCollection;}

async function applySchemaValidation(db: mongodb.Db) {
    const examSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["number","time", "options"],
            additionalProperties: false,
            properties: {
                _id: {},
                number: {
                    bsonType: "int",
                    description: "'number' is required and is an int"
                },
                score: {
                    bsonType: "string",
                    description: "'score' is optional and is a string"
                },
                questions: {
                    bsonType: ["array"],
                    description: "'questions' is optional and is an array of strings",
                    minItems: 0,
                    maxItems: 255,
                    items: {
                        bsonType: "string",
                        description: "question ID number"
                    }
                },
                incorrect: {
                    bsonType: ["array"],
                    description: "'incorrect' is optional and is an array of strings",
                    minItems: 0,
                    maxItems: 255,
                    items: {
                        bsonType: "string",
                        description: "question ID number"
                    }
                },
                flagged: {
                    bsonType: ["array"],
                    description: "'flagged' is optional and is an array of strings",
                    minItems: 0,
                    maxItems: 255,
                    items: {
                        bsonType: "string",
                        description: "question ID number"
                    }
                },
                time: {
                    bsonType: "string",
                    description: "'time' is required and is a string"
                },
                current: {
                    bsonType: "string",
                    description: "'current' is optional and is a string"
                },
                options: {
                    bsonType: ["array"],
                    description: "'qflag' is optional and is an array of strings",
                    minItems: 0,
                    maxItems: 255,
                    items: {
                        bsonType: "object",
                        required: ["place","holder"],
                        additionalProperties: false,
                        description: "options must contain the following fields",
                        properties: {
                            place: {
                                bsonType: "string",
                                description: "TBD"
                            },
                            holder: {
                                bsonType: "string",
                                description: "TBD",
                            }
                        }
                    }
                },

            },
        },
    };
    const questionSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["question","optionA","optionB","optionC","optionD","answer"],
            additionalProperties: false,
            properties: {
                question: {
                    bsonType: "string",
                    description: "'question' is required and is a string"
                },
                image: {
                    bsonType: "string",
                    description: "'image' is optional and is a string"
                },
                optionA: {
                    bsonType: "string",
                    description: "'optionA' is required and is a string"
                },
                optionB: {
                    bsonType: "string",
                    description: "'optionB' is required and is a string"
                },
                optionC: {
                    bsonType: "string",
                    description: "'optionC' is required and is a string"
                },
                optionD: {
                    bsonType: "string",
                    description: "'optionD' is required and is a string"
                },
                answer: {
                    enum: [
                        "A",
                        "B",
                        "C",
                        "D"
                    ],
                    description: "'answer' is required and must use one of the listed options"
                },
                explanation: {
                    bsonType: "string",
                    description: "'explanation' is optional and is a string"
                },
            },
        },
    };

    await db.command({
        collMod: "exams",
       validator: examSchema
    }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("exams", {validator: examSchema});
       }
    });
    
    await db.command({
        collMod: "questions",
       validator: questionSchema
    }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("questions", {validator: questionSchema});
       }
    });
}