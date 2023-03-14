import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
              <th>Available</th>
              <th>Action</th>
          </tr>
      </thead>

      <tbody>
          <tr *ngFor="let exam of exams$ | async">
              <td>{{exam.number}}</td>
              <td>{{exam.score}}</td>
              <td>{{exam.time}}</td>
              <td>{{exam.current}}</td>
              <td>
                 <!--TODO: conditional - only show one ("Continue"/"Review") -->
                 <button class="btn btn-primary me-1" [routerLink]="['continue/', exam._id]">Continue</button>
                 <button class="btn btn-primary me-1" [routerLink]="['review/', exam._id]">Review</button>
              </td>
          </tr>
      </tbody>
  </table>

  <button class="btn btn-primary mt-3" [routerLink]="['options']">Start a New Exam</button>
`
})
export class ExamsListComponent implements OnInit {
  exams$: Observable<Exam[]> = new Observable();
  num = 1;

  constructor(private examsService: ExamService) { }

  ngOnInit(): void {
    this.fetchExams();
  }

  deleteExam(id: string): void {
    this.examsService.deleteExam(id).subscribe({
      next: () => this.fetchExams()
    });
  }

  private fetchExams(): void {
    this.exams$ = this.examsService.getExams();
  }
}