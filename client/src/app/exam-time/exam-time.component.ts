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
    <h2 class="text-center m-3" num=1> Question {{num}}</h2>  
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
    <div></div>
    <div class="row">
      <div class="col">
        <div class="form-check form-switch">
          <button class="btn btn-primary mt-3" *ngIf="num > 1" (click)="prevQ()"> <-- Previous</button>
        </div>
      </div>
      <div class="col">
      <div class="form-check form-switch">
        <button class="btn btn-primary mt-3" *ngIf="options$.value.details" (click)="submitQ()"> Submit </button>
      </div>
    </div>
      <div class="col">
       <div class="form-check form-switch">
          <button class="btn btn-primary mt-3" *ngIf="num < examQs$.value.length" (click)="nextQ()">Next --></button>
        </div>
      </div>
    </div>

    <!--
    <table class="table table-striped table-bordered">
    <thead>
      <tr>
        <th>question id</th>
        <th>question</th>
      </tr>
    </thead>
    <tbody>
    <tr *ngFor="let question of examQs$ | async">
      <td>{{question._id}}</td>
      <td>{{question.question}}</td>
    </tr>
  </tbody>
  </table> -->

  </div>
  `,
  styles: [
  ]
})
export class ExamTimeComponent implements OnInit {
  num = 1;
  
  @Input() 
  initialState: BehaviorSubject<Exam> = new BehaviorSubject({});

  @Output()
  nextQuestion = new EventEmitter<Exam>();

  @Output()
  prevQuestion = new EventEmitter<Exam>();

  @Output()
  pauseExam = new EventEmitter<Exam>();


  exam: BehaviorSubject<Exam> = new BehaviorSubject({});
  currQ: BehaviorSubject<Question> = new BehaviorSubject({});
  examQs$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  //options$ = new Subject<Option>
  options$: BehaviorSubject<Option> = new BehaviorSubject<Option>({qCount: 0, details: false});
  timeRemaining$: Observable<number> = new Observable<number>();
  answerMap$: BehaviorSubject<Map<Number, String>> = new BehaviorSubject(new Map());
  extimer = 0;
  timerSub: Subscription = new Subscription();
  pausetimer = new Subject();
  answerMap = new Map;
  answerRadio = '';

  currExam: Exam = {};

  constructor(
    // private router: Router,
    private route: ActivatedRoute,
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
      // this.answerMap$.next(exam.answers !)
      // console.log(this.answerMap$.value);
      // if(exam.answers){
      //   //this.answerMap = exam.answers;
      // }
      this.currQ.next(this.examQs$.value.find(q => q._id == this.exam.value.current) !);
      //this.resetAnswer(); // TODO: in case of resume exam
      console.log(this.exam.value);
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
      // save exam progress
      this.saveExamProgress();
      this.num -= 1;

      // if timer is paused, unpause
      if(this.pausetimer){
        this.setTimer(this.extimer);
      }

      // select next question to be displayed
      this.currQ.next(this.examQs$.value[this.num-1]);

      this.resetAnswer();  
  }

  //display next question - if details off, save answer choice. Unpause timer if paused.
  nextQ(){
    
    // save exam progress
    this.saveExamProgress();
    this.num += 1;
  
    // if timer is paused, unpause
    if(this.pausetimer){ 
      this.setTimer(this.extimer);
    }

    // select next question to be displayed
    // this.currQ.next(this.examQs$.value.find(q => q._id == this.exam.value.current) !);
    this.currQ.next(this.examQs$.value[this.num-1]);

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

  resetAnswer(){
    if(this.answerMap.get(this.num)){
      this.answerRadio = this.answerMap.get(this.num);
    }else{
      this.answerRadio = '';
    }
  }

  //TODO: Not sure if answerMap is being stored properly - will need to test. Maybe mongodb storing but not displaying properly? idk
  saveExamProgress(){
    //save answer selection
    this.answerMap.set(this.num, this.answerRadio)

    //update exam entry in DB (do on each prev/next/submit to save exam progress)
    this.currExam.answers = this.answerMap;
    this.currExam.current = this.examQs$.value[this.num-1]._id;
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

    console.log(this.currExam.answers);
  }
}
