// import * as mongodb from "mongodb";

export interface Question {
    _id?: string;
    question: string; // question text
    image: string; // corresponding image link if applicable
    optionA: string; // option A
    optionB: string; // option B
    optionC: string; // option C
    optionD: string; // option D
    answer: "A" | "B" | "C" | "D" | "#"; // correct answer
    userAnswer: "A" | "B" | "C" | "D"; // user-submitted answer
    explanation: string; // expalanation of answer
    flag?: boolean;
    weight?: number;
    //topic: string;
    //difficulty: "1" | "2" | "3" | "4" | "5"
}