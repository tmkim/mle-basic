T Planet - mle-basic-client.vercel.app/
--> Web app for taking practice exams with customizable exam options (no users)

** Initial development complete (current: v1.1.6) **
-- will be updating for bugs and UI updates -- 

Components/Features - 
    * Exam list
        - list of exams that have been taken
            * continue if user exit exam before completion
            * review exams that were completed
            * delete previous exams 
                > exam numbers will be updated 
        - button to begin new exam 
    * New Exam Options 
        - able to configure options for creating a new exam 
            * number of exam questions 
            * toggle details 
                > questions may be submitted individually
                    .. show correct answer + explanation
                    .. pause timer 
            * toggle flag priority 
                > flagged questions will populate the exam before filling randomly
            * set time per question (in seconds)
        - check for empty exam - if none, create new
            * populate empty exam based on options configuration 
            * questions are added by weight - weight + 1 when question is used
                > questions will not repeat until all questions have been asked
                > weight does not increase when adding via flag priority
    * Exam Time!
        - scrollable list of all questions in left side-bar 
            * click on a question number navigates to that question 
        - frequently saves exam progress in case of accidental exit 
        - questions may be flagged for review 
            > flags are saved so they can be used in subsequent exams 
        - if details are on, questions may be submitted individually
            > else, entire exam is submitted at once
        - May save progress and quit -> continue later 
        - Exam is forcibly submitted once timer hits 0:00
    * Exam Review 
        - displays grade (X / Y)
        - displays all questions, answers, and explanations 
        - "Flagged" button to hide non-flagged questions 
        - "Home" button to return to exam list 
        - display exam and question number where question is taken from 
            > based on question ID number 

To set up practice for a different exam, point to a different DB 
    - Mongo DB tables + schema will be applied upon running server 
    - fill "questions" with json that matches the question schema 

For local use - set up mongo DB and configure ATLAS_URI=<mongo_url> in server/.env
              - run in development mode, 
              or set client/src/environments/envirionment.ts {api_url: 'http://localhost:5200'}
