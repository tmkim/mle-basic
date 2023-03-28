import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-begin-exam',
  template: `
    <h2 class="text-center m-5">Begin New Exam</h2>
    <app-options (formSubmitted)="beginExam($event)"></app-options>
  `,
  styles: [
  ]
})
export class BeginExamComponent {
  constructor(
    private router: Router,
    private examService: ExamService
  ){}

  beginExam(exam: Exam){
    console.log("begin!");
    console.log(exam._id);
    
    this.router.navigate(['/exam-time', 'asdf']);
    /*
    TODO: update exam entry with number=0 to latest number (n)
    TODO: change below to update empty exam to be current exam
      + update DB entry with options + initial exam config 
    *
    this.examService.createExam(exam) 
      .subscribe({
        next: () => {
          this.router.navigate(['/examtime', exam._id]);
        },
        error: (error) => {
          alert("Failed to begin exam");
          console.error(error);
        }
      });*/
  }
}
