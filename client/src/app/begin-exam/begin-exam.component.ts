import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { Question } from '../question';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-begin-exam',
  template: `
    <h2 class="text-center m-5">Begin New Exam</h2>
    <app-options (formSubmitted)="beginExam($event)"></app-options>
    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>question id</th>
          <th>question</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let question of questions$ | async">
          <td>{{question._id}}</td>
          <td>{{question.question}}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
  ]
})
export class BeginExamComponent {

  newExam: Exam = {
    number: 0,
    score: '',
    questions: new Array<Question>,
    incorrect: new Array<String>,
    flagged: new Array<String>,
    time: 0,
    current: '',
    options: new Array<Object>
  };

  questions$: Observable<Question[]> = new Observable();
  exams$: Observable<Exam[]> = new Observable();
  examQs$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  arr_examQs: any[] = [];
  num_seconds = 0;
  num_exams = 0;

  arr_questions: any[] = [];

  constructor(
    private router: Router,
    private examService: ExamService,
    private questionService: QuestionService
  ){}

  ngOnInit(): void{

  }

  beginExam(exam: Exam): void{
    console.log("begin!");
    console.log(exam.options);

    this.update_exam(exam);
    
    //this.router.navigate(['/exam-time', exam._id]);
  }

  //options[0] == options[qCount]
  //calculate timer based on number of questions
  set_timer(exam: any): void{
    this.num_seconds = exam.options[0] * 72;
    this.newExam.time = this.num_seconds;
  }

  // randomly grabs qCount questions from questions database
  set_exam_questions(exam: any): void{
    //this.newExam.questions = this.questionService.getExamQuestions(exam.options[0])
    this.questionService.getExamQuestions(exam.options[0]).subscribe(qList => {
      this.examQs$.next(qList);
      // console.log(this.newExam.questions[0]);
      this.newExam.questions = this.examQs$.value;
      this.newExam.current = this.newExam.questions[0]._id;
      //console.log(this.examQs$.value);
      console.log(this.newExam);

      this.examService.updateExam(exam._id || '', this.newExam)
       .subscribe({
          next: () => {
                this.router.navigate(['/exam-time', exam._id]);
          },
          error: (e) => {
            alert(`Failed to update exam: ${exam._id}`);
            console.error(e);
          }
        })
  })
  console.log(this.arr_examQs);

  // Optional TODO: add logic to grab more intelligently (unasked Qs, incorrect Qs, no repeats, etc) -> in question.services.ts

  /* This uses Subject<Question[]> instead of Question[].. not sure which is better yet
     this.questionService.getExamQuestions(options[0]).subscribe(res =>
     this.arr_questions.push(res));*/
  }

  set_exam_num(): void{
    this.examService.getExams().subscribe(
      data => {
    this.newExam.number = data.length;
      }
    );
  }

  update_exam(exam: Exam): void{

    this.set_exam_num();
    this.set_timer(exam);
    this.newExam.options = exam.options;
    this.set_exam_questions(exam);

    console.log(exam);

    // this.examService.updateExam(exam._id || '', this.newExam)
    //  .subscribe({
    //   next: () => {
    //         this.router.navigate(['/exam-time', exam._id]);
    //   },
    //   error: (e) => {
    //     alert(`Failed to update exam: ${exam._id}`);
    //     console.error(e);
    //   }
    //  })

    // update DB entry for current exam 

  }
}
