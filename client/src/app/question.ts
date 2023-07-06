export interface Question {
    _id?: string;
    examKey?: string;
    question?: string;
    image?: string;
    optionA?: string; 
    optionB?: string; 
    optionC?: string; 
    optionD?: string; 
    answer?: "A" | "B" | "C" | "D" | "#";
    userAnswer?: "A" | "B" | "C" | "D";
    explanation?: string;
    flag?: boolean;
    weight?: number;
    //topic?: string;
    //difficulty?: "1" | "2" | "3" | "4" | "5"
}