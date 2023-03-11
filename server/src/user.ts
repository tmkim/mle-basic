import * as mongodb from "mongodb";

export interface User{
    _id?: mongodb.ObjectId;
    user: string;
    password: string; //encryption? oauth?
    name: string;
    qlist: Array<string>; //list of questions asked
    qwrong: Array<string>; //list of questions answered incorrectly
    qflag: Array<string>; //list of questions flagged for further review
}