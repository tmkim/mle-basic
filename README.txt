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