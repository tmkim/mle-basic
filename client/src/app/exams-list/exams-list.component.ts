import { Component, OnInit } from '@angular/core';
import { min, Observable } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-exams-list',
  template: `
  <h2 class="text-center m-5">Exams List</h2>

  <table class="table table-striped table-bordered">
      <thead>
          <tr>
              <th>Exam Number</th>
              <th>Score</th>
              <th>Time</th>
              <!--th>Current Question</th-->
              <th>Action</th>
          </tr>
      </thead>

      <tbody>
          <tr *ngFor="let exam of exams$ | async">
          <ng-container *ngIf="$any(exam)?.number > 0">
              <td>{{exam.number}}</td>
              <td>{{exam.score}}</td>
              <td>{{timeFormat($any(exam)?.time)}}
              <!--td>{{exam.current}}</td-->
              <td>
                 <button class="btn btn-primary me-1" *ngIf="$any(exam)?.time > 0" [routerLink]="['/exam-time/', exam._id]">Continue</button>
                 <button class="btn btn-primary me-1" *ngIf="exam.time == 0" [routerLink]="['/review/', exam._id]">Review</button>
                 <button class="btn btn-danger" (click)="deleteExam(exam._id || '', exam.number || 0)">Delete</button>
              </td>
            </ng-container>
          </tr>
      </tbody>
  </table>

  <button class="btn btn-primary mt-3" [routerLink]="['/new-exam']">Start a New Exam</button>
`
})
export class ExamsListComponent implements OnInit {
  exams$: Observable<Exam[]> = new Observable();
  num = 1;

  constructor(private examsService: ExamService) { }

  ngOnInit(): void {
    this.fetchExams();
  }

  deleteExam(id: string, num: number): void {
    // if(confirm("Are you sure you want to delete Exam number "+num+"?")) {
    //   this.examsService.deleteExam(id).subscribe({
    //     next: () => this.fetchExams()
    //   });
    // }
    this.examsService.deleteExam(id).subscribe({
      next: () => this.fetchExams()
    });
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