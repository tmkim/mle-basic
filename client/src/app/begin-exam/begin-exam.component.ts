import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { Question } from '../question';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-begin-exam',
  template: `
    <h2 class="text-center m-5">Begin New Exam</h2>
    <app-options (formSubmitted)="beginExam($event)"></app-options>
  `,
  styles: [
  ]
})
export class BeginExamComponent implements OnInit, OnDestroy {

  newExam: Exam = {
    examKey: '',
    number: -1,
    score: '',
    answers: new Array<String>,
    questions: new Array<Question>,
    incorrect: new Array<String>,
    correct: new Array<String>,
    flagged: new Array<String>,
    time: 0,
    current: '',
    options: {},
  };

  exams$: Observable<Exam[]> = new Observable();
  examQs$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  num_seconds = 0;
  num_exams = 0;
  subscription_ge = new Subscription;
  subscription_geq = new Subscription;
  subscription_ue = new Subscription;
  subscription_uq = new Subscription;

  constructor(
    private router: Router,
    private examService: ExamService,
    private questionService: QuestionService,
  ){}

  ngOnInit(): void{
  }

  ngOnDestroy(): void{
    console.log('begin-exam unsubscribe')
    this.subscription_geq.unsubscribe()
    this.subscription_ge.unsubscribe()
    this.subscription_ue.unsubscribe()
    this.subscription_uq.unsubscribe()
  }

  beginExam(exam: Exam): void{
    console.log(exam)
    exam.examKey = exam.options?.examKey
    this.update_exam(exam);
  }

  // randomly grabs qCount questions from questions database
  update_exam(exam: any): void{
    this.newExam.time = exam.options.qCount * exam.options.timePerQ
    this.newExam.options = exam.options;
    this.newExam.examKey = exam.examKey;

    this.subscription_geq = this.questionService.getExamQuestions(exam.options).pipe(take(1)).subscribe(qList => {
      qList.forEach(q => {
        // add flagged questions to exam flagged array
        if(q.flag){
          this.newExam.flagged?.push(q._id!)
        }
        // update question weights
        var qWeight: Question = {weight: q.weight! + 1};
        if(this.newExam.options?.flagPrio){
            //do not update weight if question is repeated for flag prio
            if(!q.flag){
              this.subscription_uq = this.questionService.updateQuestion(q._id!, qWeight).pipe(take(1)).subscribe();
          }
        }
        else{
          //if flag priority does not matter, update question weight 
          this.subscription_uq = this.questionService.updateQuestion(q._id!, qWeight).pipe(take(1)).subscribe();
        }
      })
      this.examQs$.next(qList);
      this.newExam.questions = this.examQs$.value;
      this.newExam.current = this.newExam.questions[0]._id;

      //get # of exams before updating 
      this.subscription_ge = this.examService.getExams().pipe(take(1)).subscribe({
        next: (data) => {
          this.newExam.number = data.length;
          this.subscription_ue = this.examService.updateExam(exam._id || '', this.newExam)
            .pipe(take(1)).subscribe({
              next: () => {
                this.router.navigate(['/exam-time/', exam._id]);
              },
              error: (e) => {
                alert(`Failed to update exam: ${exam._id}`);
                console.error(e);
              }
            });
          }
        }
      );
    })
  }
}
