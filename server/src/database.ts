import * as mongodb from "mongodb";
import { Question } from "./question";
import { Exam } from "./exam";
import { Flagged } from "./flagged";

export const examColl:{
    exams?: mongodb.Collection<Exam>;
} = {};

export const questionColl:{
    questions?: mongodb.Collection<Question>;
} = {};

export const flaggedColl:{
    flagged?: mongodb.Collection<Flagged>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("twmle-basic");
    await applySchemaValidation(db);

    const examsCollection = db.collection<Exam>("exams");
    examColl.exams = examsCollection;

    const questionsCollection = db.collection<Question>("questions");
    questionColl.questions = questionsCollection;

    const flaggedCollection = db.collection<Flagged>("flagged");
    flaggedColl.flagged = flaggedCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const examSchema = {
        $jsonSchema: {
            bsonType: "object",
//            required: ["number","time", "options"],
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
                    description: "'questions' is optional and is an array of objects",
                    minItems: 0,
                    maxItems: 255,
                    items: {
                        bsonType: "object",
                        description: "array of question objects"
                    }
                },
                answers: {
                    bsonType: ["array"],
                    description: "'answers' is an optional array of provided answers"
                  }
                  ,
                incorrect: {
                    bsonType: ["array"],
                    description: "'incorrect' is optional and is an array of strings",
                    minItems: 0,
                    maxItems: 255,
                    items: {
                        bsonType: "string",
                        description: "array of incorrect question ID numbers"
                    }
                },
                correct: {
                    bsonType: ["array"],
                    description: "'correct' is optional and is an array of strings",
                    minItems: 0,
                    maxItems: 255,
                    items: {
                        bsonType: "string",
                        description: "array of correct question ID numbers"
                    }
                },
                flagged: {
                    bsonType: ["array"],
                    description: "'flagged' is optional and is an array of strings",
                    minItems: 0,
                    maxItems: 255,
                    items: {
                        bsonType: "string",
                        description: "array of flagged question ID numbers"
                    }
                },
                time: {
                    bsonType: "int",
                    description: "'time' is required and is an int"
                },
                current: {
                    bsonType: "string",
                    description: "'current' is optional and is a string"
                },
                options: {
                    // bsonType: ["array"],
                    // description: "'options' is an optional array of objects",
                    // minItems: 0,
                    // maxItems: 2,
                    // items: {
                        bsonType: "object",
//                        required: ["place","holder"],
                        additionalProperties: false,
                        description: "options must contain the following fields",
                        properties: {
                            qCount: {
                                bsonType: "int",
                                description: "qCount is a number that represents how many questions are in the exam"
                            },
                            details: {
                                bsonType: "bool",
                                description: "details is a boolean that represents whether an expalanation will be showed after each question or not",
                            },
                            flagPrio: {
                                bsonType: "bool",
                                description: "flagPrio is a boolean that represents whether the exam will prioritize flagged questions during creation",
                            },
                        }
                    //}
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
                _id: {},
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
                        "D",
                        "#"
                    ],
                    description: "'answer' is required and must use one of the listed options"
                },
                userAnswer: {
                    enum: [
                        "A",
                        "B",
                        "C",
                        "D",
                        ""
                    ],
                    description: "'userAnswer' is optional and must use one of the listed options"
                },
                explanation: {
                    bsonType: "string",
                    description: "'explanation' is optional and is a string"
                },
                flag: {
                    bsonType: "bool",
                    description: "'flag' is an optional boolean"
                },
                weight: {
                    bsonType: "int",
                    description: "'weight' is an optional integer"
                }
            },
        },
    };
    const flaggedSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["q_id"],
            additionalProperties: false,
            properties: {
                _id: {},
                q_id: {
                    bsonType: "string",
                    description: "'q_id' is required and is a string"
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

    await db.command({
        collMod: "flagged",
       validator: flaggedSchema
    }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("flagged", {validator: flaggedSchema});
       }
    });
}