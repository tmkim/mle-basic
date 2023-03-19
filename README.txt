Basic exam app for tw mle (no users)


03/11/2023
    > initial server and client config + CRUD operations
        > mle-basic/client$ ng new client --routing --style=css --minimal
        > mle-basic/client$ ng serve -o 
    > create Angular interface for exams and questions 
        > mle-basic/client$ ng generate interface exam 
            - generates client/src/app/exam.ts
                * can copy over interface from server/src/exam.ts 
    > create service for exams and questions 
        > mle-basic/client$ ng generate service exam 
    > create component (reusable code used to display a view)
        > ng generate component exam-list 
        > ng generate component exam ?? 
        > ng generate component exam-time -m app
    > register copmonent to app.routing.module.ts 
    > TODO: exam-time!!!

03/12/2023
    > exam-options
        - number of questions (range input)
        - show answer details (switch input)
        - "Begin" button
            TODO: > starts test - set timer based on questions, pick specified number of questions, start exam-time!
    TODO: > exam-time form component
        - shows a single question at a time 
         x radio buttons (answer choices)
         x "next" + "previous" buttons
         + list of question numbers (clickable, scrollable)
         + timer
        - hidden answer explanation/details 
    TODO: > exams-list pulls exams out of database, start new test functionality (goto exam-options)

03/14/2023
    > exam-time component~
        - build basic structure
            * Show question # header
            * show single question text 
            * show 4 answer choice radio buttons 
            * Previous and Next buttons 
        - TODO: add functionality to next/previous buttons, pull question info from database 
            > next/prev button should save answer, load next/prev question
                - load saved answer as well in case already answered 
        - TODO: add countdown timer, list of question numbers on the side (ngFor)

    > TODO : don't forget to store answers for current exam !!

03/18/2023
    > update redirect paths 
    ... Let me spend a bit of time planning this out:
        * homepage - exam list, start a new exam 
            - exam list allows you to review or continue an exam 
                - if review: examtime UI but radio buttons are locked
                    ** if timer == 0 (timer set to 0 on exam submission)
                - if continue: normal examtime UI (loads exam id from db)
                    ** if timer != 0 (exam has not been submitted / time did not run out)
            - Start a new exam brings up Options:
                - User sets number of questions, toggle details
                - Initiate new examtime based on params
                    > calculate time 
                    > randomly choose exam questions
                    > create entry in exams database 
            - It's Exam Time!
                - load exam info from database, save to local variables
                    > save detail toggle as boolean, question list as hashmap?
                - Display question, answer choices 
                - User can choose Next/Previous (disable on first/last questions)
                - Update database on Next/Previous ("auto-save")
                    ** check if database would be changed before attempt update?
                - If details toggle is on, pause timer and show details until next question 
                    ** Update question list on side with correct/incorrect flag 
                - If details toggle is off, do not pause timer, do not show correct/incorrect/details until end of exam
                    ** load "review" interface on test submission 