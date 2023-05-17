export interface Question {
    _id?: string;
    question?: string;
    image?: string;
    optionA?: string; 
    optionB?: string; 
    optionC?: string; 
    optionD?: string; 
    answer?: "A" | "B" | "C" | "D" | "#";
    userAnswer?: "A" | "B" | "C" | "D";
    explanation?: string;
    //topic?: string;
    //difficulty?: "1" | "2" | "3" | "4" | "5"
}