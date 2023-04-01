import * as mongodb from "mongodb";
import { Question } from "./question";

export interface Exam {
    _id?: mongodb.ObjectId;
    number: number; //-1 if EmptyExam, else ascending
    score: string; // "[correct answers]/[total questions]"
    questions: Array<Question>; // list of questions used in test in order (as presented in exam)
    incorrect: Array<string>; // list of questions answered incorrectly
    flagged: Array<string>; //list of questions that are flagged for extra review
    time: number; //time left in seconds (in case test is paused). 0 if done.
    current: string; //current question id# in case test is paused
    options: Array<object>; //options configured for test
}