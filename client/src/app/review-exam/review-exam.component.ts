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
    <button class="btn btn-primary mt-3 btn_toggleF" *ngIf="!showFlag" (click)="toggleFlag()">Flagged</button>
    <button class="btn btn-primary mt-3 btn_toggleT" *ngIf="showFlag" (click)="toggleFlag()">Flagged</button>
    <div class="score">Final Score: {{exam.value.score}}</div> 
  </h2>
  <table class="table table-striped table-bordered" border="2px solid black">
    <colgroup>
      <col span="1" style="width: 5%;">
      <col span="1" style="width: 5%;">
      <col span="1" style="width: 50%;">
      <col span="1" style="width: 40%;">
    </colgroup>
    <thead>
      <tr>
          <th>Flag</th>
          <th>Correct</th>
          <th>Question</th>
          <th>Options</th>
      </tr>
    </thead>
    <tbody>
      <ng-container *ngIf="!showFlag; else onlyFlag">
        <ng-container *ngFor="let q of examQs | async; let i = index">
          <tr>
            <td>
              <!--div class="flag-space"><i class="bi bi-flag-fill flag" *ngIf="arr_flaggedQs$.value.includes(q._id)"></i></div-->
              <div class="flag-space"><i class="bi bi-flag-fill flag" *ngIf="q.flag"></i></div>
            </td>
            <td>
              <div class="cor-space" *ngIf="q.userAnswer == q.answer"><i class="bi bi-check-lg correct"></i></div>
              <div class="incorrect" *ngIf="q.userAnswer != q.answer">X</div>
            </td>
            <td>{{i+1}}. {{q.question}}</td>
            <td>
              <div class="answers">
                <div class="row" *ngIf="q.userAnswer != 'A' && q.userAnswer != 'B' && q.userAnswer != 'C' && q.userAnswer != 'D'">
                <i style="color:red;font-weight:420">No Response!</i>
                </div>
                <div class="row" [ngStyle]="q.answer != 'A' && q.userAnswer == 'A' ? {'color':'red','font-weight': '420'} : q.answer == 'A' ? {'color':'green','font-weight': '420'} : {'':''}">
                  A. {{q.optionA}}
                </div>
                <div class="row" [ngStyle]="q.answer != 'B' && q.userAnswer == 'B' ? {'color':'red','font-weight': '420'} : q.answer == 'B' ? {'color':'green','font-weight': '420'} : {'':''}">
                B. {{q.optionB}}
                </div>
                <div class="row" [ngStyle]="q.answer != 'C' && q.userAnswer == 'C' ? {'color':'red','font-weight': '420'} : q.answer == 'C' ? {'color':'green','font-weight': '420'} : {'':''}">
                C. {{q.optionC}}
                </div>
                <div class="row" [ngStyle]="q.answer != 'D' && q.userAnswer == 'D' ? {'color':'red','font-weight': '420'} : q.answer == 'D' ? {'color':'green','font-weight': '420'} : {'':''}">
                D. {{q.optionD}}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <div>{{q.explanation}}</div>
            </td>
          </tr>
        </ng-container>
      </ng-container>
      <ng-template #onlyFlag>
        <ng-container *ngFor="let q of examQs | async; let i = index">
          <!--ng-container *ngIf="arr_flaggedQs$.value.includes(q._id)"-->
          <ng-container *ngIf="q.flag">
            <tr>
              <td>
                <!--div class="flag-space"><i class="bi bi-flag-fill flag" *ngIf="arr_flaggedQs$.value.includes(q._id)"></i></div-->
                <div class="flag-space"><i class="bi bi-flag-fill flag" *ngIf="q.flag"></i></div>
              </td>
              <td>
                <div class="cor-space" *ngIf="q.userAnswer == q.answer"><i class="bi bi-check-lg correct"></i></div>
                <div class="incorrect" *ngIf="q.userAnswer != q.answer">X</div>
              </td>
              <td>{{i+1}}. {{q.question}}</td>
              <td>
                <div class="answers">
                  <div class="row" *ngIf="q.userAnswer != 'A' && q.userAnswer != 'B' && q.userAnswer != 'C' && q.userAnswer != 'D'">
                  <i style="color:red;font-weight:420">No Response!</i>
                  </div>
                  <div class="row" [ngStyle]="q.answer != 'A' && q.userAnswer == 'A' ? {'color':'red','font-weight': '420'} : q.answer == 'A' ? {'color':'green','font-weight': '420'} : {'':''}">
                    A. {{q.optionA}}
                  </div>
                  <div class="row" [ngStyle]="q.answer != 'B' && q.userAnswer == 'B' ? {'color':'red','font-weight': '420'} : q.answer == 'B' ? {'color':'green','font-weight': '420'} : {'':''}">
                  B. {{q.optionB}}
                  </div>
                  <div class="row" [ngStyle]="q.answer != 'C' && q.userAnswer == 'C' ? {'color':'red','font-weight': '420'} : q.answer == 'C' ? {'color':'green','font-weight': '420'} : {'':''}">
                  C. {{q.optionC}}
                  </div>
                  <div class="row" [ngStyle]="q.answer != 'D' && q.userAnswer == 'D' ? {'color':'red','font-weight': '420'} : q.answer == 'D' ? {'color':'green','font-weight': '420'} : {'':''}">
                  D. {{q.optionD}}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div>{{q.explanation}}</div>
              </td>
            </tr>
          </ng-container>
        </ng-container>
      </ng-template>
    </tbody>
  `,
  styles: [
    `@import "~bootstrap-icons/font/bootstrap-icons.css";
    .correct { color:green; font-size: 30px; -webkit-text-stroke-width: 3px; }
    .cor-space { padding-top: 20px; padding-left:10px }
    .flag-space { padding-top: 20px; padding-left:5px }
    .incorrect { color:red; font-size: 32px; -webkit-text-stroke-width: 3px; padding-top:25px; padding-left:15px}
    .flag { color: red; font-size: 30px; display: inline;}
    .answers {padding-left: .7rem; padding-right: .5rem;}
    .btn_toggleF {margin-left: 10px; background-color:red}
    .btn_toggleT {margin-left: 10px; background-color:green}
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
  arr_flaggedQs$: BehaviorSubject<Array<any>> = new BehaviorSubject(new Array);
  showFlag = false;
  
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
      this.arr_flaggedQs$.next(exam.flagged !);
      this.incorrect.next(exam.incorrect !);
    });
  }

  toggleFlag(){
    this.showFlag = !this.showFlag
  }
}
