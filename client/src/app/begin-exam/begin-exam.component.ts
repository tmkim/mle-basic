import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  questions$: Observable<Question[]> = new Observable();
  exams$: Observable<Exam[]> = new Observable();
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
  }

  // randomly grabs qCount questions from questions database
  set_exam_questions(exam: any): void{
  this.arr_questions = this.questionService.getExamQuestions(exam.options[0])

  // Optional TODO: add logic to grab more intelligently (unasked Qs, incorrect Qs, no repeats, etc) -> in question.services.ts

  // Below uses Subject<Question[]> instead of Question[].. not sure which is better yet
  // this.questionService.getExamQuestions(options[0]).subscribe(res =>
  //   this.arr_questions.push(res));
  }

  set_num_exams(exam: Exam): void{
    this.examService.getExams().subscribe(
      data => {
        exam.number = data.length;
      }
    );

  }

  update_exam(exam: Exam): void{
    this.set_num_exams(exam);
    this.set_timer(exam);
    this.set_exam_questions(exam);
    exam.questions = this.arr_questions; //*** fix "questions" in DB to be object array? or build question array based on this.questions$ ?
    exam.time = this.num_seconds; //*** fix "time" to be number instead of string

    //exam.options is already set

    // update DB entry for current exam 
    // number = latest number (n), question array, time, options

  }
}
