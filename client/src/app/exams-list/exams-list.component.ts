import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { QuestionService } from '../question.service';
import { Question } from '../question';
@Component({
  selector: 'app-exams-list',
  template: `
  <h2 class="text-center m-5">Exams List</h2>

  <table class="table table-striped table-bordered center">
  <thead>
      <tr>
          <th>Key</th>
          <th>Exam</th>
          <th>Score</th>
          <th>Time</th>
          <th>Details</th>
          <th>Action</th>
      </tr>
  </thead>

  <tbody>
      <tr *ngFor="let exam of exams$ | async">
      <ng-container *ngIf="$any(exam)?.number > 0">
          <td class="eK">{{exam.examKey}}</td>
          <td class="num">{{exam.number}}</td>
          <td class="score">{{exam.score}}</td>
          <td class="time">{{timeFormat($any(exam)?.time)}}
          <td class="details">{{$any(exam.options)?.details? 'On' : 'Off'}}
          <td class="actions">
             <button class="btn btn-primary me-1" *ngIf="$any(exam)?.time > 0" [routerLink]="['/exam-time/', exam._id]">Continue</button>
             <button class="btn btn-primary me-1" *ngIf="exam.time == 0" [routerLink]="['/review/', exam._id]">Review</button>
             <button class="btn btn-danger" (click)="deleteExam(exam._id!, exam.number!)">Delete</button>
          </td>
        </ng-container>
      </tr>
  </tbody>
</table>
<table class="center">
<button class="btn btn-primary mt-3" [routerLink]="['/new-exam']">Start a New Exam</button>
<button class="btn btn-primary mt-3" (click)="refreshQs()" style="margin-left: 200px">Refresh Questions</button>
</table>
`,
styles:[`

th, td {
  padding-left: .5rem;
  border: 2px solid black;
}
.center {
  margin-left: auto;
  margin-right: auto;
}

table {
  width: 520px;
}
td.eK{
  width: 50px;
}
td.num{
  width: 50px;
}
td.score{
  width: 80px;
}
td.time{
  width: 80px;
}
td.details{
  width: 50px;
}
td.actions{
  width: 260px;
}

/* if the browser window is at least 1000px-s wide: */
@media screen and (min-width: 840px) {
  table {
  width: 60%;
  }
  td.num{
    width: 12%;
  }
  td.score{
    width: 19%;
  }
  td.time{
    width: 19%;
  }
  td.details{
    width: 13%;
  }
  td.actions{
    width: 38%;
  }
}

`]
})

export class ExamsListComponent implements OnInit, OnDestroy {
  exams$: Observable<Exam[]> = new Observable();
  tmp_exams$: Observable<Exam[]> = new Observable();

  questions$: Subject<Question[]> = new Subject();
  qUpdate: Question = {
    examKey: 'twmle1A'
  }

  // num = 1;
  ex_count = 0;
  subscription_de = new Subscription();
  subscription_qu = new Subscription();

  newExam: Exam = {
    number: -1
  };

  constructor(
    private examsService: ExamService,
    private questionService: QuestionService
    ) { }

  ngOnInit(): void {
    this.fetchExams();
  }

  ngOnDestroy(): void {
    console.log('exams-list unsubscribe')
    this.subscription_de.unsubscribe()
    this.subscription_qu.unsubscribe()
  }

  deleteExam(id: string, num: number): void {
    this.ex_count = 0;

    if(confirm("Are you sure you want to delete Exam number "+num+"?")) {
      this.subscription_de = this.examsService.deleteExam(id).subscribe({
        next: () => {
          console.log(`Exam Deleted: ${id}`);
          this.exams$ = this.examsService.updateExamNums()
        }
      })
    }
  }

  refreshQs(): void{
    this.questionService.getQuestions().subscribe( qs => {
      qs.forEach(q => {
        console.log(q)
        this.subscription_qu = this.questionService.updateQuestion(q._id!, this.qUpdate).subscribe();
      })
    console.log("refresh complete")
  })

  }

  timeFormat(totalSeconds: number): string{
    const totalMinutes = Math.floor(totalSeconds / 60);

    const h = Math.floor(totalMinutes / 60);
    const m = (totalMinutes % 60);
    const s = (totalSeconds % 60)
  
    const seconds = s.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    const hours = h.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    const minutes = m.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });

    var timeStr
  
    if(h > 0){
      timeStr = `${hours}:${minutes}:${seconds}`;
    }
    else{
      timeStr = (`${minutes}:${seconds}`);
    }

    return timeStr
  }

  private fetchExams(): void {
    this.exams$ = this.examsService.getExams();
  }
}