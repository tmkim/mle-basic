import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { Question } from '../question';

@Component({
  selector: 'app-review-exam',
  template: `
  <table class="table table-striped table-bordered">
    <thead>
      <tr>
          <th>Correct</th>
          <th>Question</th>
          <th>Options</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let q of examQs | async">
        <td>
          <ng-container *ngIf="q.userAnswer == q.answer"><div>Y</div></ng-container>
          <ng-container *ngIf="q.userAnswer != q.answer"><div>N</div></ng-container>
        </td>
        <td>{{q.question}}</td>
        <td>
          <div class="row" [ngStyle]="{'color':q.answer != 'A' && q.userAnswer == 'A' ? 'red' : q.answer == 'A' ? 'green' : '' }">
            {{q.optionA}}
          </div>
          <div class="row" [ngStyle]="{'color':q.answer != 'B' && q.userAnswer == 'B' ? 'red' : q.answer == 'B' ? 'green' : '' }">
            {{q.optionB}}
          </div>
          <div class="row" [ngStyle]="{'color':q.answer != 'C' && q.userAnswer == 'C' ? 'red' : q.answer == 'C' ? 'green' : '' }">
            {{q.optionC}}
          </div>
          <div class="row" [ngStyle]="{'color':q.answer != 'D' && q.userAnswer == 'D' ? 'red' : q.answer == 'D' ? 'green' : '' }">
            {{q.optionD}}
          </div>
        </td>
      </tr>
    </tbody>
  `,
  styles: [
    `
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
