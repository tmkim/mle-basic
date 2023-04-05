import * as mongodb from "mongodb";

export interface Exam {
    _id?: mongodb.ObjectId;
    number: number; //-1 if EmptyExam, else ascending
    score: string; // "[correct answers]/[total questions]"
    questions: Array<Object>; // list of questions used in test in order (as presented in exam)
    incorrect: Array<String>; // list of questions answered incorrectly
    flagged: Array<String>; //list of questions that are flagged for extra review
    time: number; //time left in seconds (in case test is paused). 0 if done.
    current: String; //current question id# in case test is paused
    options: Array<Object>; //options configured for test
}