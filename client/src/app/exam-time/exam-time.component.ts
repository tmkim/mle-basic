import { Component, Input, EventEmitter, OnInit, Output, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { takeUntil, takeWhile } from 'rxjs/operators';
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
    <div class="container">
      <h2 class="text-center m-3" num=1> Question {{qNum$.value}}</h2>  
      <div class="col">
        <h3>
          {{ timeRemaining$ | async | date:'mm:ss' }}      
        </h3>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col">
          <p>{{currQ.value.question}}</p>  
        </div>
      </div>
      <ng-container *ngIf="currQ.value.image">
        <div>display image here </div>
      </ng-container>
    </div>

    <div class="container">
      <div class="form-check">
        <div class="row-1">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" [(ngModel)]="answerRadio" value="A">
          <label class="form-check-label" for="flexRadioDefault1">
            {{currQ.value.optionA}}
          </label>
        </div>
        <div class="row-2">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" [(ngModel)]="answerRadio" value="B">
          <label class="form-check-label" for="flexRadioDefault2">
            {{currQ.value.optionB}}
          </label>
        </div>
        <div class="row-3">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" [(ngModel)]="answerRadio" value="C">
          <label class="form-check-label" for="flexRadioDefault3">
            {{currQ.value.optionC}}
          </label>
        </div>
        <div class="row-4">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4" [(ngModel)]="answerRadio" value="D">
          <label class="form-check-label" for="flexRadioDefault4">
            {{currQ.value.optionD}}
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-check form-switch">
            <button class="btn btn-primary mt-3" [disabled]="qNum$.value <= 1" (click)="prevQ()"> <-- Previous</button>
          </div>
        </div>
        <div class="col">
          <div class="form-check form-switch">
            <button class="btn btn-primary mt-3" *ngIf="options$.value.details" (click)="submitQ()"> Submit </button>
          </div>
        </div>
        <div class="col">
          <div class="form-check form-switch">
              <button class="btn btn-primary mt-3" [disabled]="qNum$.value >= examQs$.value.length" (click)="nextQ()">Next --></button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <div class="form-check form-switch">
            <!--button class="btn btn-primary mt-3" [disabled]="qNum$.value != examQs$.value.length" (click)="submitExam()">Submit Exam</button-->
            <button class="btn btn-primary mt-3" (click)="submitExam()">Submit Exam</button>
          </div>
        </div>
        <div class="col"></div>
    </div>
  `,
  styles: [
  ]
})
export class ExamTimeComponent implements OnInit {

  qNum$: BehaviorSubject<number> = new BehaviorSubject(1);
  exam: BehaviorSubject<Exam> = new BehaviorSubject({});
  currQ: BehaviorSubject<Question> = new BehaviorSubject({});
  examQs$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  options$: BehaviorSubject<Option> = new BehaviorSubject<Option>({qCount: 0, details: false});
  arr_Answers$: BehaviorSubject<Array<any>> = new BehaviorSubject(new Array);
  pausetimer = new Subject();
  currExam: Exam = {};
  answerRadio = '';
  incorrectQs = new Array();

  timeRemaining$: Observable<number> = new Observable<number>();
  timerSub: Subscription = new Subscription();
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
  
    this.examService.getExam(id !).subscribe((exam) => {
      this.exam.next(exam);
      this.setTimer(exam.time !);
      this.examQs$.next(exam.questions !);
      this.options$.next(exam.options !);
      this.arr_Answers$.next(exam.answers !)
      this.currQ.next(this.examQs$.value.find(q => q._id == this.exam.value.current) !);
      this.qNum$.next(this.examQs$.value.findIndex(q => q._id == this.exam.value.current)+1 !);
      console.log(this.examQs$.value);
      console.log(this.currQ);
      console.log(this.qNum$.value);

      //TODO: start on "current" question
      this.resetAnswer();
    });
  }

  setTimer(time: number){
    var seconds = time;
    this.timeRemaining$ = timer(0, 1000).pipe(
      map(n => (seconds - n) * 1000),
      //takeWhile(n => n >= 0, !this.pausetimer),// && !this.pausetimer),
      takeUntil(this.pausetimer)
    );
    this.timerSub = this.timeRemaining$.subscribe(t => {
      //console.log(t);
      this.extimer = t/1000;
      if (t < 0){
        this.pausetimer.next(0);
        this.examOOT();
      }
    })
    // this.config.leftTime = seconds;
  }

  //Exam Out Of Time! (Time Remaining == 0)
  examOOT(){

  }

  //display previous question - if details off, save answer choice. Unpause timer if paused.
  prevQ(){
    this.arr_Answers$.value[this.qNum$.value-1] = this.answerRadio;
    this.qNum$.next(this.qNum$.value - 1);

      // if timer is paused, unpause
      if(this.pausetimer){
        this.setTimer(this.extimer);
      }

      // select next question to be displayed
      this.currQ.next(this.examQs$.value[this.qNum$.value-1]);

      // save exam progress
      this.saveExamProgress();

      this.resetAnswer();  
  }

  //display next question - if details off, save answer choice. Unpause timer if paused.
  nextQ(){
    this.arr_Answers$.value[this.qNum$.value-1] = this.answerRadio;
    this.qNum$.next(this.qNum$.value + 1);

    // if timer is paused, unpause
    if(this.pausetimer){ 
      this.setTimer(this.extimer);
    }

    // select next question to be displayed
    // this.currQ.next(this.examQs$.value.find(q => q._id == this.exam.value.current) !);
    // this.currQ.next(this.examQs$.value[this.num-1]);
    this.currQ.next(this.examQs$.value[this.qNum$.value-1]);

    // save exam progress
    this.saveExamProgress();
    
    this.resetAnswer();
  }

  // button only available if details are on
  submitQ(){

    this.saveExamProgress();
  
    //pause timer
    this.timerSub.unsubscribe()
    this.pausetimer.next(0); 
  
    //TODO: display answer details
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
    console.log(this.currExam);

    this.examService.updateExam(this.exam.value._id || '', this.currExam)
      .subscribe({
      next: () =>{
        console.log('exam submitted');
        this.router.navigate([`/review/${this.exam.value._id}`]);
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
        this.incorrectQs.push(this.examQs$.value[index]._id);
      }

      if(this.currExam.questions){
        this.currExam.questions[index].userAnswer = answer;
      }
    })
    this.currExam.score = `${correct}/${this.examQs$.value.length}`;
    this.currExam.incorrect = this.incorrectQs;
  }

  resetAnswer(){
    if(this.arr_Answers$.value[this.qNum$.value-1]){
      this.answerRadio = this.arr_Answers$.value[this.qNum$.value-1];
    }else{
      this.answerRadio = '';
    }
  }

  saveExamProgress(){
    //update exam entry in DB (do on each prev/next/submit to save exam progress)
    this.currExam.answers = this.arr_Answers$.value;
    this.currExam.current = this.examQs$.value[this.qNum$.value-1]._id;
    //TODO: this.currExam.flagged
    //TODO: this.currExam.incorrect (if details on)
    this.currExam.time = this.extimer;
    //TODO: on finish exam - this.currExam.score
    this.examService.updateExam(this.exam.value._id || '', this.currExam)
      .subscribe({
      next: () =>{
        console.log('exam progress saved');
      },
      error: (e) => {
        alert("failed to update exam");
        console.error(e);
      }
    })

    console.log(this.currQ);
    console.log(this.qNum$.value);
    console.log(this.currExam.answers);
  }
}