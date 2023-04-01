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

    this.set_timer(exam.options);
    this.set_exam_questions(exam.options);
    this.update_exam(exam);
    
    //this.router.navigate(['/exam-time', exam._id]);
  }

  set_timer(options: any): void{
    //options[0] == options[qCount]
    var num_qCount = options[0];
    this.num_seconds = num_qCount * 72;
    //calculate timer based on number of questions
  }

  set_exam_questions(options: any): void{
    // randomly grab qCount questions from questions database
    // add logic to grab more intelligently (unasked Qs, incorrect Qs, no repeats, etc)
    this.questions$ = this.questionService.getExamQuestions(options[0]);
  }

  update_exam(exam: Exam): void{
    exam.number = this.examService.getNumExams();
    //exam.questions = this.questions$; *** fix "questions" in DB to be object array? or build question array based on this.questions$ ?
    //exam.time = this.num_seconds; *** fix "time" to be number instead of string
    //exam.options is already set

    // update DB entry for current exam 
    // number = latest number (n), question array, time, options

  }
}
