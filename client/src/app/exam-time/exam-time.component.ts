import { Component, Input, EventEmitter, OnInit, Output, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Exam } from '../exam';
import { Question } from '../question';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';
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
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
          <label class="form-check-label" for="flexRadioDefault1">
          {{currQ.value.optionA}}
          </label>
      </div>
      <div class="row-2">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
        <label class="form-check-label" for="flexRadioDefault2">
        {{currQ.value.optionB}}
        </label>
      </div>
      <div class="row-3">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
        <label class="form-check-label" for="flexRadioDefault3">
        {{currQ.value.optionC}}
        </label>
      </div>
      <div class="row-4">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4">
        <label class="form-check-label" for="flexRadioDefault4">
        {{currQ.value.optionD}}
        </label>
      </div>
    </div>
    <div></div>
    <div class="row">
      <div class="col">
        <div class="form-check form-switch">
          <button class="btn btn-primary mt-3" [routerLink]="['prev']"> <-- Previous</button>
        </div>
      </div>
      <div class="col">
       <div class="form-check form-switch">
          <button class="btn btn-primary mt-3" (click)="nextQ(timeRemaining$)">Next --></button>
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

//  @Input() 
//   seconds = 300;
//   timeRemaining$ = timer(0, 1000).pipe(
//     map(n => (this.seconds - n) * 1000),
//     takeWhile(n => n >= 0),
//   );


  exam: BehaviorSubject<Exam> = new BehaviorSubject({});
  currQ: BehaviorSubject<Question> = new BehaviorSubject({});
  examQs$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  timeRemaining$: Observable<number> = new Observable<number>();
  timer = 0;

  // config: CountdownConfig = {};

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

      this.currQ.next(this.examQs$.value.find(q => q._id == this.exam.value.current) !);
      console.log(this.exam.value);
    });
  }

  // handleEvent(ev: CountdownEvent){
  //   console.log(ev);
  //   if (ev.action == 'notify'){
      
  //   }
  // }

  setTimer(time: number){
    var seconds = time;
    this.timeRemaining$ = timer(0, 1000).pipe(
      map(n => (seconds - n) * 1000),
      takeWhile(n => n >= 0),
    );
    // this.config.leftTime = seconds;
  }

  nextQ(timer: Observable<number>){
    timer.subscribe(t => console.log(t));
  }
}
