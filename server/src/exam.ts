import * as mongodb from "mongodb";

export interface Exam {
    _id?: mongodb.ObjectId;
    user: string; // user ID that test belongs to
    number: number; //0 if most recent, else in order
    score: string; // "[correct answers]/[total questions]"
    questions: Array<string>; // list of questions used in test in order (as presented in exam)
    incorrect: Array<string>; // list of questions answered incorrectly
    flagged: Array<string>; //list of questions that are flagged for extra review
    time: string; //"xx:xx" time left in case test is paused. 00:00 if done.
    current: string; //current question id# in case test is paused
    options: Array<object>; //options configured for test
}