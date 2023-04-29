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

03/12/2023
    > exam-options
        - number of questions (range input)
        - show answer details (switch input)
        - "Begin" button
           DONE: > starts test - set timer based on questions, pick specified number of questions, start exam-time!
    DONE: > exam-time form component
        - shows a single question at a time 
         x radio buttons (answer choices)
         x "next" + "previous" buttons
         + list of question numbers (clickable, scrollable)
         + timer
        - hidden answer explanation/details 
    DONE: > exams-list pulls exams out of database, start new test functionality (goto exam-options)

03/14/2023
    > exam-time component~
        - build basic structure
            * Show question # header
            * show single question text 
            * show 4 answer choice radio buttons 
            * Previous and Next buttons 
        - DONE: add functionality to next/previous buttons, pull question info from database 
            > next/prev button should save answer, load next/prev question
                - load saved answer as well in case already answered 
        - DONE: add countdown timer, list of question numbers on the side (ngFor)

    > DONE : don't forget to store answers for current exam !!

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

03/23/2023
    - implement basic countdown timer  
        > DONE: pass input based on number of questions  
    - OPTIONS:
        * on init, I want to create a new exam entry in database
            ** require exam id #, question count = 0
            ** check if there is already a "new exam entry" in database, in case exam was not started from last time options was opened
                ^^ can check for an exam with question count = 0
            ** save exam id # as var for reference
        * user sets question count and detail flag (default false)
        * on Begin, update exam id question count, detail flag, timer, questions, etc. 
    - working on the above. in progress.
    - saved value of options to variables 
    - set up initial createExam 
        -> need to make sure initial "empty exam" is created, also check to see if empty exam exists
    - starting to set up submit button to create new exam 
        -> need to make new component for StartExam?
    ** DONE: search for exam with number = -1

03/24/2023
    - working on query database for EmptyExam
    - created dummy "EmptyExam" in database and non-EmptyExam 
    - query for ID works, trying to figure out if/how I can set up multiple get() or need to conditionalize one
    ^ used conditional, query works, trying to figure out how to store result for use outside of subscribe

03/26/2023
    - Kind of got a handle on using query results in code and displaying on screen
    - Working on error handling for 404 not found.
    ^ in progress
        * DONE: create new empty exam during handling

03/28/2023
    - use options component in begin-exam component 
    - clean up routing 
    * DONE: figure out why Begin button is not working ??
        >> fixed --> submit button was in an inner <form> so outer <form> submission logic did not apply 
    ** OPTIONAL TODO: make options form pretty (fix spacing when shrinking window size)
    ** DONE: make sure current EmptyExam is being passed properly
        --> form controls ?

03/31/2023
    - set up form array for options 
    - start building skeleton for exam creation
    - calculate time based on number of questions 
    - DONE: make dummy questions, grab questions with smart RNG
        ** update EmptyExam to no longer be empty
        ** create empty exam if none 

04/01
    - imported 40 dummy questions into database using json
        ** _id is string instead of mongodb obj? we'll see how that goes
        ** want to figure out way to import with _id autogenerated probably
    - build exam with qCount random questions (non-repeating)
    - work on updating emptyexam with initial exam config
        ** need to update database structure 

04/01 p2
    - did more work on configuring initial exam config > mostly done 
    - cleaned up twmle-basic database config and validators

04/05 
    - Work on updating database properly (exam)
    - need to work on building question list properly!! 
        * console.log(array) shows array but array[0] shows undefined ??
        - I think it is built correctly but need to use value outside of subscribe 
    ** Need to work on properly passing question list to update exam!
        - going to try moving update call to inside of set_question subscription

04/05 p2
    - Successfully update empty exam with initial config based on options 
        > properly update number, question list, time, options, current 
    - Create new empty exam if no empty exam exists 

04/06
    - Plan:
        > start working on exam-time functionality 
    - on init, load exam data and display first question 
    - npm install ngx-countdown (countdown timer)
        ** couldn't get it working well? Says I need to make sure it is part of module but if I add to app.module.ts it breaks other things?
    - Timer starts at correct value, need to figure out how to save value.


04/09
    - Work on timer ! 
    >> Timer works pretty well~
        - timer starts at appropriate value 
        - timer pauses on submit -> saves value and can update database with new value (DONE)
        - timer starts again on prev/next 
        - cleaned up "timer" component

    - answerMap to keep track of answers provided for each question #
    - radio button functionality 
        > checks answerMap if answer has been provided - if so, radio button selected by default. else no selection.
        > set ngModel for buttons to access and reset values
    - update questions appropriately when going next/prev 

04/11
    - Now that basic exam functionality is set up, things I need to work on:
        - Non-detail workflow vs Detail workflow 
        - "Continue" and "Review" buttons (disable on condition)
        - "Flag" questions 
        - update UI to show list of questions on side bar 
    - Today I work on non-detail workflow~
        - "submit" and "next" are the same -> maybe "submit" invis? next() calls submit() 

    - "submit" invisible if details are off, "prev" invis on q1, "next" invis on last q
    - change Option() class to be interface 
    - include "answers" map in Exams database table //DONE: make sure DB is saving map correctly 
    - saveExamProgress() called on each button click 
        TODO: Show details on submit( button )
    - DONE: save and reload exam on page refresh 
    - DONE: figure out how to make answerMap work with mongodb
        (store and retrieve value)
        > currently getting empty object on both store and retrieve 
        *** Answer is that map does not work with mongodb SAD ***

04/13
    - work on saving answer map correctly! 
        > looks like mongodb does not support storing maps
            ** Alternative - convert map to array, convert back on reload (or just use array instead)
    -- Discovered that maps do not store properly in mongodb -> replaced answerMap with arr_answers[]
        > stores and retrieves properly!
    -- added condition to "Continue" and "Review" buttons
        -> review no function yet
        -> continue pulls correct exam and current question!
        --> current question also retrieved on page refresh 
            * updated this.num to this.qNum$ (BehaviorSubject)
    -- added "Delete" button on exams-list 
    -- updated time column on exams-list to display formatted time

04/15
    -- added confirmation alert to exam deletion
    -- hide "empty exam" from exams list 
    -- cleaned up next/prev/save to make sure answers are saved properly and current question is correct on refresh/continue
    -- enable "Submit Exam" on last question 
    -- disabled "prev/next/submit exam" instead of hiding  
    -- submit exam functionality
        - calculate score 
        - redirect to "review" page 
        - set timer = 0
        - set list of incorrect answers (if details, should already be set -> skip)
    -- set up image display for questions (optional TODO: image hosting)

    -- start setting up "Review" component 
        - displays all questions and possible answers 
            > display whether user got it right/wrong 
            > highlight correct answer -- if wrong, also highlight wrong answer 

    * updated calculateScore to store user answer in currExam.question[].userAnswer 
    -- reflects in Review (appropriate Y or N -- TODO check mark / X mark)
    -- Review highlights answers in green/red
        > correct answer for each question always highlighted in green 
        > if user submit incorrect, highlight red 

TODOS:
    - scrollable question number list 
    - flaggable questions + flag list 
    - "Details on" workflow 
    - image hosting

04/28:
    > Update Review component 
        - add bootstrap icons for correct/incorrect answers 
        - update table appearance
        - add sticky header with {Home button} and {Final Score}  
        - include question number in question box 
    > Update exams list 
        - update table appearance 
        - use media query to set widths based on screen size 
    > Update exam-time 
        - Re-label buttons 
        - Add Save/Quit button 
            TODO:
                ** does not function properly on new exam
                ** does function properly on continued/refreshed exam
                ????????????????