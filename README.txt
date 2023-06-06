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
        DONE: Show details on submit( button )
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
    -- reflects in Review (appropriate Y or N -- DONE: check mark / X mark)
    -- Review highlights answers in green/red
        > correct answer for each question always highlighted in green 
        > if user submit incorrect, highlight red 

TODOS:
    - scrollable question number list (DONE-ish)
    - flaggable questions + flag list (DONE)
    - "Details on" workflow (DONE)
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
            DONE:
                ** does not function properly on new exam
                ** does function properly on continued/refreshed exam
                ????????????????

05/02:
    > look into save/quit error 
        ** Fixed by unsubscribing after routing (in begin-exam)!
        -- TODO:DONE?: clean up subscriptions everywhere and make sure to unsubscribe appropriately

05/06:
    DONE: when deleting an exam, update exam numbers to make sense 
    > work on adding sidebar nav for question numbers 
        * basics kinda functional 
            - displays table with correct amount of question numbers
            - clicking on a number will save current progress and jump to specified question number
            - Optional TODO: remove scrollbar 
            > include icon(?) to show whether answered or not, flagged
        * hides sidenav if screen is too small (DONE: include way to toggle)
    - Reposition start exam button to be directly under table 
    - update angular and add angular/material

    > working on detail workflow 
        - submit question only available if answer has been selected, and not yet submitted
        - save userAnswer to currQ on submit 
        - show details on questions that have been submitted (on submit, on return to question)
        - timer pauses when returning to a question that has been submitted
            > had trouble with refresh/init, got it fixed by adding conditions to setTimer
        ** mostly good for now~

05/07
    > work on flagging questions~
        -- add flag button, save flag info into currExam
        -- populate sidenav with flag icon 
        -- show whether question was flagged or not during review 
        ** good! flag populated, sidenav populates, saves, reloads. 
    > work on incorrect questions (when details on)
        -- update calculateScore to account for details on 
        -- update submitQ 
        -- update showing of explanation 
        -- save both incorrect and correct questions 
        ** good! [in]correct questions are properly saved, reloaded, used for scoring
        optional TODO: optimize use of correct/incorrect arrays 
    > include toggle for sidenav 
        -- add button when screen width is low enough to hide nav
        ** good! button appears when SW <= 800, toggles sidenav visibility. 

    > work on updating exam deletion to remap exam numbers 
        - kinda works but kinda funny ?? iDONO

05/09
    > working on updating exam deletion to remap exam numbers 
        - having trouble ...
            * trying to delete, get new list of exams, update number for each exam in new list 
            * new list is including the exam that was deleted.. need to delay? 
            ~ Kinda works, but you have to refresh page for numbers to be updated. Might need to figure out map/pipe?
            .. tried a few different approaches but still having trouble with refreshing list after update.
                - I think timing is weird, whenever I try to refresh the list, it tries to apply delete/update again..

05/13
    > working on updating exam deletion to remap exam numbers 
        -- GOTTEM!!!!
            * moved logic to exam.service
                -- new function "updateExamNums()"
                -- delete exam -> service.updateExamNums():
                   -- load new list into tmp_exams$, iterate to update entries, refresh this.exams$ within update

    > update exams list to show details on/off 
        ** ez clap 

    > update review component
        ** increase thickness of [in]correct answers, added "No Response"

05/16
    > update exam-time to display images (TODO: currently all missing)
    > update review-exam to display explanation

05/17
    > update Question to allow empty string in "answer" field

05/20
    > DONE : update review to display explanations better
    > Update exam-time to include answer in details if incorrect, and add labels to answer options 

    TODO : host online? images? 


05/23
    > Working on hosting with Vercel 
    -- client hosting looks good
    ** having trouble with hosting / connecting to server/database properly

05/25
    ** WAHUUUU **
    > successfully hosting app on website! https://mle-basic-client.vercel.app/
    DONE : 
        - clean up options page
        - clean up exam deletion + add confirmation
        - clean up console.log()s

05/28
    -- add toggle button to Review (show all questions vs only flagged questions)
    > start working on Flagged functionality 
        -- option to prioritize previously flagged questions when making exam 
        ** made good(?) progress but running into CORS issue with testing 
            ** not sure if related to Flagged update or not D:
            >> tested flagged on vercel, no CORS issue, need to review local config.
    > DONE : figure out how to use environment variables in client 
        -- ng generate environments (init client/src/environments)
        -- update environment.ts, environment.development.ts
        -- ng build --configuration=development
    -- some import cleanup
    
05/30
    -- derp figured out CORS issue (maybe?)
        >> update server PORT to 5200 since that's what I'm trying to connect to 
        ... no more CORS issue but can't access DB?
        -- derp it's because I had a '/' at end of URL in client env
    - fix images in exam-time

    >> work on flag priority logic
        -- "flagged" table contains list of flagged question IDs 
        -- when populating quiz, use flagged table first (randomize)
            > if more flagged than qCount, all questions will be from flagged 
            > if less flagged than qCount, fill as many flagged as possible, then pick from others 
            ** flagged Qs added to rngCheck so there are no duplicates
        -- update flagged table ???
            1. set "flagged" in question table -> occasionally go through Q table to populate flagged (would require delete all, search all, populate)
            2. check list of flags at end of each exam, don't add duplicates (not sure of good way to remove flags)
            3. add/remove flag to table as it occurs (should be ok if used properly but not sure this is optimal)
                >> should also check flagged list when making exam to make sure already-flagged items show as flagged
                ** adding flag works, issue with deleting
                 >> might need to look into updating how object IDs are stored/posted

06/01
    >> work on flag priority logic 
        -- flags are added with automatic id
        -- delete searches for q_id to get _id, then deletes
        >> save flags so they can be persistent 
            -- add "flag" to database object 
            -- add "flag" to client object 
            -- read/save "flag" on client init 
            -- update "flag" on flag()
            .. use flag instead of flag array 
                -- keep flag array logic for now, just update usage in Review 
                -- might need to keep flag array logic for purpose of displaying flags in exam-time ?
                -- update exam creation to push flag IDs into flag array on getExamQuestions 
                !! persistence works! need to fix exam creation a bit tho 
                >> having issues with deleting flags properly
                    -- sometimes if I unflag, then go next question, flag remains 
                    -- sometimes if I complete exam, questions that were unflagged show up in Review as flagged 
                    .. kinda confused by Review bc based on examQs.q.flag but showing based off exam array Q instead
                        >> tried removing usage of arrayQ entire but still appears to follow?

06/02
    >> work on flag perseverence 
        -- oooh I think the issue with Review is because questions are saved into exam 
    >> Looks like there's an issue with storing arr_flagged
        -- works well on continue but not new exam 
        ** on creation, arr_flagged has extra entry 
        ** also duplicate question -> so maybe RNG?
            ==> exam creation fault --> issue with checking whether question is already included?
        ** maybe good idea to stop using flagged table and make get() with flag in query ?
            --> going to keep flagged table, if I upgrade to having users, I can use flagged table to maintain flag lists per user_id
    ** revert review-exam to use arr_flaggedQs instead of q.flag 
    >> flagging might be ok? need to fix test creation tho

06/06
    >> work on test creation (prevent duplicates when using flag prio)
    -- fixed test creation to work with flag priority
        >> uses q.flag instead of flagged array, so will have to update when implementing users 
    -- cleaned up some debugging
    -- update review-time to display flags on q.flag instead of array 
    -- update exam-time to display sidebar flags on q.flag instead of array 

    >> next thing to work on - avoid re-using questions until all questions have been used 
    ... add weight param to questions ?
        -> increment by 1 whenever it is added to an exam
        -> when creating exam, search by starting at 0 and increment until exam is full 
        -> only need to update question/service logic
        ++ add weight table when implementing users 
