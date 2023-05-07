import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { Question } from '../question';

@Component({
  selector: 'app-review-exam',
  template: `
  <h2>
    <button class="btn btn-primary mt-3" [routerLink]="['/exams/']">Home</button>
    <div class="score">Final Score: {{exam.value.score}}</div>
  </h2>
  <table class="table table-striped table-bordered" border="2px solid black">
    <colgroup>
      <col span="1" style="width: 5%;">
      <col span="1" style="width: 55%;">
      <col span="1" style="width: 40%;">
    </colgroup>
    <thead>
      <tr>
          <th>Correct</th>
          <th>Question</th>
          <th>Options</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let q of examQs | async; let i = index">
        <td>
          <ng-container *ngIf="q.userAnswer == q.answer"><div><i class="bi bi-check-lg correct"></i></div></ng-container>
          <ng-container *ngIf="q.userAnswer != q.answer"><div class="incorrect">&nbsp;X</div></ng-container>
        </td>
        <td>{{i+1}}. {{q.question}}</td>
        <td>
          <div class="answers">
            <div class="row" [ngStyle]="{'color':q.answer != 'A' && q.userAnswer == 'A' ? 'red' : q.answer == 'A' ? 'green' : '' }">
              A. {{q.optionA}}
            </div>
            <div class="row" [ngStyle]="{'color':q.answer != 'B' && q.userAnswer == 'B' ? 'red' : q.answer == 'B' ? 'green' : '' }">
              B. {{q.optionB}}
            </div>
            <div class="row" [ngStyle]="{'color':q.answer != 'C' && q.userAnswer == 'C' ? 'red' : q.answer == 'C' ? 'green' : '' }">
              C. {{q.optionC}}
            </div>
            <div class="row" [ngStyle]="{'color':q.answer != 'D' && q.userAnswer == 'D' ? 'red' : q.answer == 'D' ? 'green' : '' }">
              D. {{q.optionD}}
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  `,
  styles: [
    `@import "~bootstrap-icons/font/bootstrap-icons.css";
    .correct { color:green; font-size: 50px; -webkit-text-stroke-width: 3px; }
    .incorrect { color:red; font-size: 42px; -webkit-text-stroke-width: 3px; padding-top:28px}
    .answers {padding-left: .7rem;}
    th, td {
      padding-left: .5rem;
      border: 2px solid black;
    }
    h2{
      position: sticky;
      top:0;
      padding:1%;
      background: white;
      //text-align: center;
    }
    .score{
      position:relative;
      top:15px;
      display:inline;
      float:right;
    }
   `
  ]
})
export class ReviewExamComponent {

  exam: BehaviorSubject<Exam> = new BehaviorSubject({});
  examQs: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  incorrect: BehaviorSubject<String[]> = new BehaviorSubject<String[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }
  
    this.examService.getExam(id !).subscribe((exam) => {
      this.exam.next(exam);
      this.examQs.next(exam.questions !);
      console.log(this.examQs.value);
      this.incorrect.next(exam.incorrect !);
    });
    
  }
}
