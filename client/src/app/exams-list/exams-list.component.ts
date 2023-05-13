import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { Console } from 'console';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-exams-list',
  template: `
  <h2 class="text-center m-5">Exams List</h2>

  <table class="table table-striped table-bordered center">
  <thead>
      <tr>
          <th>Exam</th>
          <th>Score</th>
          <th>Time</th>
          <!--th>Current Question</th-->
          <th>Action</th>
      </tr>
  </thead>

  <tbody>
      <tr *ngFor="let exam of exams$ | async">
      <ng-container *ngIf="$any(exam)?.number > 0">
          <td class="num">{{exam.number}}</td>
          <td class="score">{{exam.score}}</td>
          <td class="time">{{timeFormat($any(exam)?.time)}}
          <!--td>{{exam.current}}</td-->
          <td class="actions">
             <button class="btn btn-primary me-1" *ngIf="$any(exam)?.time > 0" [routerLink]="['/exam-time/', exam._id]">Continue</button>
             <button class="btn btn-primary me-1" *ngIf="exam.time == 0" [routerLink]="['/review/', exam._id]">Review</button>
             <button class="btn btn-danger" (click)="deleteExam(exam._id || '')">Delete</button>
          </td>
        </ng-container>
      </tr>
  </tbody>
</table>
<table class="center">
<button class="btn btn-primary mt-3" [routerLink]="['/new-exam']">Start a New Exam</button>
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
  width: 420px;
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
td.actions{
  width: 210px;
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
  td.actions{
    width: 50%;
  }
}

`]
})

export class ExamsListComponent implements OnInit {
  exams$: Observable<Exam[]> = new Observable();
  tmp_exams$: Observable<Exam[]> = new Observable();
  // num = 1;
  ex_count = 0;

  newExam: Exam = {
    number: -1
  };

  constructor(private examsService: ExamService) { }

  ngOnInit(): void {
    this.fetchExams();
  }

  deleteExam(id: string): void {
    this.ex_count = 0;

    // if(confirm("Are you sure you want to delete Exam number "+num+"?")) {
      this.examsService.deleteExam(id).subscribe({
        next: () => {
          console.log(`Exam Deleted: ${id}`);
          this.exams$ = this.examsService.updateExamNums()
        }
      })
    // }      
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