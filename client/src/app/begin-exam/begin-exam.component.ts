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

  num_seconds = 420;

  constructor(
    private router: Router,
    private examService: ExamService
  ){}

  ngOnInit(): void{

  }

  beginExam(exam: Exam): void{
    console.log("begin!");
    console.log(exam.options);

    this.set_timer(exam.options);
    this.set_exam_questions();
    this.update_exam();
    
    //this.router.navigate(['/exam-time', exam._id]);
  }

  set_timer(options: any): void{
    //options[0] == options[qCount]
    var num_qCount = options[0];
    this.num_seconds = num_qCount * 180;
    //calculate timer based on number of questions
  }

  set_exam_questions(): void{
    // randomly grab qCount questions from questions database
    // add logic to grab intelligently (unasked Qs, incorrect Qs, no repeats, etc)
  }

  update_exam(): void{
    // update DB entry for current exam 
    // number = latest number (n), question array, time, options

  }
}
