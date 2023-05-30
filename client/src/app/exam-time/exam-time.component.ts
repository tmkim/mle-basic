import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { Exam } from '../exam';
import { Question } from '../question';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { Option } from '../option';

// import { CountdownConfig, CountdownEvent } from 'ngx-countdown';

@Component({
  selector: 'app-exam-time',
  template: `
  <mat-sidenav-container class="side-container">
    <mat-sidenav mode="side" [opened]="screenW>800 || blnSidenav" disableClosed="true">
      <!--table class="table-striped side-nav-table">
        <tr *ngFor="let q of examQs$ | async; let i = index" style="height: 52px">
        <td>{{i+1}}</td>
        </tr>
      </table-->
      <mat-nav-list class="side-nav-table">
      <mat-list-item class="side-nav-items" routerLink="." *ngFor="let q of examQs$ | async; let i = index" (click)="goQuestion(i)">
          <div mat-line style="color:black;">{{i+1}}
          <span class="incorrect" *ngIf="arr_incorrect$.value.includes(q._id)">X&nbsp;</span>
          <i class="bi bi-check-lg correct" *ngIf="arr_correct$.value.includes(q._id)">&nbsp;</i>
          <i class="bi bi-flag-fill" style="color:red" *ngIf="arr_flaggedQs$.value.includes(q._id)"></i>
          </div>
        </mat-list-item>
      </mat-nav-list>
    </mat-sidenav>
    
    <mat-sidenav-content style="padding-left:32px;margin-right:32px">
      <div>
        <button (click)="sidenavToggle()" *ngIf="screenW<=800" class="hide-btn">
          <i class="bi bi-list sn-tog"></i>
        </button>
        <h2 class="text-center m-3"> Question {{qNum$.value}}&nbsp;&nbsp;
          <button *ngIf="!currFlag" class="hide-btn" (click)="flagQ()"><i class="bi bi-flag fFlag"></i></button>
          <button *ngIf="currFlag" class="hide-btn" (click)="flagQ()"><i class="bi bi-flag-fill tFlag" ></i></button>
        </h2>
        <div class="col">
          <h1>
            {{ timeRemaining$ | async | date:'h:mm:ss':'UTC' }}      
          </h1>
        </div>
      </div>

      <div>
        <div class="row">
          <div class="col">
            <p>{{currQ$.value.question}}</p>  
          </div>
        </div>
        <ng-container *ngIf="currQ$.value.image != ''" class="q-img">
          <div>{{currQ$.value.image}}</div>
        </ng-container>
      </div>

      <div>
        <div class="form-check">
          <div class="row-1">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
              [(ngModel)]="answerRadio" [disabled]="['B','C','D'].includes(currQ$.value.userAnswer!)" value="A">
            <label class="form-check-label" for="flexRadioDefault1">
              A. {{currQ$.value.optionA}}
            </label>
          </div>
          <div class="row-2">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" 
              [(ngModel)]="answerRadio" [disabled]="['A','C','D'].includes(currQ$.value.userAnswer!)" value="B">
            <label class="form-check-label" for="flexRadioDefault2">
              B. {{currQ$.value.optionB}}
            </label>
          </div>
          <div class="row-3">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" 
            [(ngModel)]="answerRadio" [disabled]="['A','B','D'].includes(currQ$.value.userAnswer!)" value="C">
            <label class="form-check-label" for="flexRadioDefault3">
              C. {{currQ$.value.optionC}}
            </label>
          </div>
          <div class="row-4">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4" 
            [(ngModel)]="answerRadio" [disabled]="['A','B','C'].includes(currQ$.value.userAnswer!)" value="D">
            <label class="form-check-label" for="flexRadioDefault4">
              D. {{currQ$.value.optionD}}
            </label>
          </div>
        </div>

        <ng-container *ngIf="showExplain">
          <div style="margin-top:20px">

            <i class="exp-incorrect" *ngIf="arr_incorrect$.value.includes(currQ$.value._id)">Incorrect! --> *{{currQ$.value.answer}}*</i>
            <i class="exp-correct" *ngIf="arr_correct$.value.includes(currQ$.value._id)">Correct!</i>
          </div>
          <div>{{currQ$.value.explanation}}</div>
        </ng-container>

        <div class="row">
          <div class="col">
            <div class="form-check form-switch">
              <button class="btn btn-primary mt-3" [disabled]="qNum$.value <= 1" (click)="prevQ()"> <--Previous</button>
            </div>
          </div>
          <div class="col">
            <div class="form-check form-switch">
              <button class="btn btn-primary mt-3" *ngIf="options$.value.details"  (click)="submitQ()"
              [disabled]="answerRadio == '' || ['A','B','C','D'].includes(currQ$.value.userAnswer!)"> Submit </button>
            </div>
          </div>
          <div class="col">
            <div class="form-check form-switch">
                <button class="btn btn-primary mt-3" [disabled]="qNum$.value >= examQs$.value.length" (click)="nextQ()">Next--></button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col"></div>
          <div class="col">
            <div class="form-check form-switch">
              <button class="btn btn-primary mt-3" (click)="saveQuit()">Save/Quit</button>
            </div>
          </div>
          <div class="col">
            <div class="form-check form-switch">
              <button class="btn btn-primary mt-3" (click)="submitExam()">DONEDONE</button>
            </div>
          </div>
          <div class="col"></div>
        </div>
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
  styles: [`
  @import "~bootstrap-icons/font/bootstrap-icons.css";

  .side-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    color: black;
  }
  .tFlag { font-size: 25px; color:red; -webkit-text-stroke-width: 2px; }
  .fFlag { font-size: 25px; color:red; -webkit-text-stroke-width: 2px; }
  .incorrect { color:red; font-size: 15px; -webkit-text-stroke-width: 2px; }
  .correct { color:green; font-size: 20px; -webkit-text-stroke-width: 2px; }
  .exp-incorrect { color:red; font-size: 20px; }
  .exp-correct { color:green; font-size: 20px; }
  .q-img { margin-top: 16px; margin-bottom: 16px}
  .sn-tog{
    position: absolute;
    top:0;
    left:0;
    font-size: 40px; 
    -webkit-text-stroke-width: 2px;
  }
  .hide-btn{
    background:none;
    border:none
  }
  .side-nav-table{
    width: 120px;
  }
  table td{
    padding-top:5px;
    padding-bottom:5px;
    padding-left: 7px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
  }
  table tr:first-child td {
    border-top: 0;
  }
  table tr:last-child td {
    border-bottom: 0;
  }
  mat-nav-list mat-list-item{
    padding-top:5px;
    padding-bottom:5px;
    padding-left: 7px;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
  }
  .side-nav-items{
    background:rgb(200,200,200);

  }
  `
  ]
})
export class ExamTimeComponent implements OnInit {

  qNum$: BehaviorSubject<number> = new BehaviorSubject(1);
  exam$: BehaviorSubject<Exam> = new BehaviorSubject({});
  currQ$: BehaviorSubject<Question> = new BehaviorSubject({});
  examQs$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  options$: BehaviorSubject<Option> = new BehaviorSubject<Option>({qCount: 0, details: false});
  arr_Answers$: BehaviorSubject<Array<any>> = new BehaviorSubject(new Array);
  arr_incorrect$: BehaviorSubject<Array<any>> = new BehaviorSubject(new Array);
  arr_correct$: BehaviorSubject<Array<any>> = new BehaviorSubject(new Array);
  arr_flaggedQs$: BehaviorSubject<Array<any>> = new BehaviorSubject(new Array);
  pausetimer = new Subject();
  currExam: Exam = {};
  answerRadio = '';
  screenW = 0;
  showExplain = false;
  currFlag = false;
  blnSidenav = false;

  sub_init = new Subscription();
  sub_update = new Subscription();
  timerSub: Subscription = new Subscription();

  timeRemaining$: Observable<number> = new Observable<number>();
  extimer = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }
    this.screenW = window.innerWidth;

    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenW = window.innerWidth;
    }
  
    this.examService.getExam(id !).subscribe((exam) => {
      this.exam$.next(exam);
      this.setTimer(exam.time !);
      this.examQs$.next(exam.questions !);
      this.options$.next(exam.options !);
      this.arr_Answers$.next(exam.answers !);
      this.arr_incorrect$.next(exam.incorrect !);
      this.arr_correct$.next(exam.correct !);
      this.arr_flaggedQs$.next(exam.flagged !);
      this.currQ$.next(this.examQs$.value.find(q => q._id == this.exam$.value.current) !);
      this.qNum$.next(this.examQs$.value.findIndex(q => q._id == this.exam$.value.current)+1 !);
      this.resetAnswer();
      
      // console.log(this.examQs$.value);
      // console.log(this.currQ);
      // console.log(this.qNum$.value);
      // this.checkExplain();
    });
  }

  setTimer(time: number){
    var seconds = time;
    console.log(seconds)
    
    this.timeRemaining$ = timer(0, 1000).pipe(
      map(n => (seconds - n) * 1000),
      //takeWhile(n => n >= 0, !this.pausetimer),// && !this.pausetimer),
      takeUntil(this.pausetimer)
    );
    this.timerSub = this.timeRemaining$.subscribe(t => {
      //console.log(t);
      this.extimer = t/1000;
      if ( this.exam$.value.options?.details && ['A','B','C','D'].includes(this.currQ$.value.userAnswer!) && this.extimer < seconds){
        this.showExplain = true;
        this.pausetimer.next(0);
        this.extimer += 1;
      }
      if (t < 0){
        this.pausetimer.next(0);
        this.submitExam();
      }
    })    
  }

  //display previous question - if details off, save answer choice. Unpause timer if paused.
  prevQ(){
    this.arr_Answers$.value[this.qNum$.value-1] = this.answerRadio;
    this.qNum$.next(this.qNum$.value - 1);

    // if timer is paused, unpause
    // if(this.pausetimer){
    //   this.setTimer(this.extimer);
    // }

    // select next question to be displayed
    this.currQ$.next(this.examQs$.value[this.qNum$.value-1]);

    // save exam progress
    this.saveExamProgress();

    this.checkExplain();
    this.resetAnswer();  
  }

  //display next question - if details off, save answer choice. Unpause timer if paused.
  nextQ(){
    this.arr_Answers$.value[this.qNum$.value-1] = this.answerRadio;
    this.qNum$.next(this.qNum$.value + 1);

    // select next question to be displayed
    // this.currQ.next(this.examQs$.value.find(q => q._id == this.exam.value.current) !);
    // this.currQ.next(this.examQs$.value[this.num-1]);
    this.currQ$.next(this.examQs$.value[this.qNum$.value-1]);

    // save exam progress
    this.saveExamProgress();
    
    this.checkExplain();
    this.resetAnswer();
  }
  
  goQuestion(ind: any){
    this.arr_Answers$.value[this.qNum$.value-1] = this.answerRadio;
    this.qNum$.next(ind+1);

    // if timer is paused, unpause
    // if(this.pausetimer){ 
    //   this.setTimer(this.extimer);
    // }

    this.currQ$.next(this.examQs$.value[ind]);

    // save exam progress
    this.saveExamProgress();
    
    this.checkExplain();
    this.resetAnswer();
    //console.log(ind)
  }

  // button only available if details are on
  submitQ(){
  
    //pause timer
    this.timepause();

    this.showExplain = true;
    this.arr_Answers$.value[this.qNum$.value-1] = this.answerRadio;
    this.currQ$.value.userAnswer = this.arr_Answers$.value[this.qNum$.value-1];
    if(this.currQ$.value.userAnswer != this.currQ$.value.answer){
      this.arr_incorrect$.value.push(this.currQ$.value._id)
    }else{
      this.arr_correct$.value.push(this.currQ$.value._id)
    }
    this.saveExamProgress();
    //TODO: display answer details
  }

  timepause(){
    this.timerSub.unsubscribe()
    this.pausetimer.next(0); 
  }

  saveQuit(){
    //update exam entry in DB (do on each prev/next/submit to save exam progress)
    this.arr_Answers$.value[this.qNum$.value-1] = this.answerRadio;
    this.currExam.answers = this.arr_Answers$.value;
    this.currExam.current = this.examQs$.value[this.qNum$.value-1]._id;
    //TODO: this.currExam.flagged
    //TODO: this.currExam.incorrect (if details on)
    this.currExam.time = this.extimer;
    //TODO: on finish exam - this.currExam.score
      
    this.examService.updateExam(this.exam$.value._id || '', this.currExam)
    .subscribe({
      next: () =>{
        //console.log('exam saved/quit');
        this.router.navigate([`/exams/`]);
      },
      error: (e) => {
        alert("failed to update exam");
        console.error(e);
      }
    })
  }

  submitExam(){
    // * save answer for last question
    // * calculate score 
    // * set timer = 0
    // * set list of incorrect answers (if details, should already be set -> skip)
    // * redirect to "review" page 
    this.arr_Answers$.value[this.qNum$.value-1] = this.answerRadio;
    this.calculateScore();
    this.currExam.time = 0;
    //console.log(this.currExam);

    this.examService.updateExam(this.exam$.value._id || '', this.currExam)
      .subscribe({
      next: () =>{
        //console.log('exam submitted');
        this.router.navigate([`/review/${this.exam$.value._id}`]);
      },
      error: (e) => {
        alert("failed to update exam");
        console.error(e);
      }
    })
  }

  calculateScore(){
    var correct = 0;
    this.currExam.questions = this.examQs$.value;
    this.arr_Answers$.value.forEach((answer, index) =>{
      if(answer == this.examQs$.value[index].answer){
        correct += 1;
      }else{
        if(!this.exam$.value.options?.details){
          this.arr_incorrect$.value.push(this.examQs$.value[index]._id);
        }
      }
      if(this.currExam.questions){
        this.currExam.questions[index].userAnswer = answer;
      }
    })
    this.currExam.score = `${correct}/${this.examQs$.value.length}`;
    this.currExam.incorrect = this.arr_incorrect$.value;
  }

  resetAnswer(){
    if(this.arr_Answers$.value[this.qNum$.value-1]){
      this.answerRadio = this.arr_Answers$.value[this.qNum$.value-1];
    }else{
      this.answerRadio = '';
    }
    if(this.arr_flaggedQs$.value.includes(this.examQs$.value[this.qNum$.value-1]._id)){
      this.currFlag = true;
    }else{
      this.currFlag = false;
    }
  }

  saveExamProgress(){
    //update exam entry in DB (do on each prev/next/submit to save exam progress)
    this.currExam.answers = this.arr_Answers$.value;
    this.currExam.current = this.examQs$.value[this.qNum$.value-1]._id;
    this.currExam.questions = this.examQs$.value;
    this.currExam.flagged = this.arr_flaggedQs$.value;
    this.currExam.incorrect = this.arr_incorrect$.value;
    this.currExam.correct = this.arr_correct$.value;
    this.currExam.time = this.extimer;
    //TODO: on finish exam - this.currExam.score
    this.examService.updateExam(this.exam$.value._id || '', this.currExam)
      .subscribe({
      next: () =>{
        console.log('Exam progress saved');
      },
      error: (e) => {
        alert("failed to update exam");
        console.error(e);
      }
    })

    // console.log(this.currQ$);
    // console.log(this.qNum$.value);
    // console.log(this.currExam.answers);
  }

  checkExplain(){
    this.showExplain = false;
    if(this.exam$.value.options?.details){
      if(['A','B','C','D'].includes(this.currQ$.value.userAnswer!)){
        this.showExplain = true;
        this.timepause();
        // console.log('check explain true');
      }
      else{
        this.showExplain = false;
        // console.log('check explain false');
        // console.log(this.currQ$.value.userAnswer);
        // if timer is paused, unpause
        if(this.pausetimer){ 
          this.setTimer(this.extimer);
        }
      }
    }
    else{
      // if timer is paused, unpause
      if(this.pausetimer){ 
        this.setTimer(this.extimer);
      }
    }
  }

  flagQ(){
    this.currFlag = !this.currFlag
    if(this.currFlag){
      this.arr_flaggedQs$.value.push(this.examQs$.value[this.qNum$.value-1]._id);
    }else{
      var ind = this.arr_flaggedQs$.value.indexOf(this.examQs$.value[this.qNum$.value-1]._id)
      if(ind != -1){
        this.arr_flaggedQs$.value.splice(ind,1);
      }
    }
    this.saveExamProgress();
  }

  sidenavToggle(){
    this.blnSidenav = !this.blnSidenav
  }
}