import { Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { Question } from '../question';
import { QuestionService } from '../question.service';
import { Option } from '../option';

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

  newExam: Exam = {
    number: -1,
    score: '',
    answers: new Map(),
    questions: new Array<Question>,
    incorrect: new Array<String>,
    flagged: new Array<String>,
    time: 0,
    current: '',
    options: {},
  };

  exams$: Observable<Exam[]> = new Observable();
  examQs$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  num_seconds = 0;
  num_exams = 0;

  constructor(
    private router: Router,
    private examService: ExamService,
    private questionService: QuestionService
  ){}

  ngOnInit(): void{
  }

  beginExam(exam: Exam): void{
    this.update_exam(exam);
  }

  // randomly grabs qCount questions from questions database
  update_exam(exam: any): void{
    this.newExam.time = exam.options.qCount * 72
    this.newExam.options = exam.options;

    this.questionService.getExamQuestions(exam.options.qCount).subscribe(qList => {
      this.examQs$.next(qList);
      this.newExam.questions = this.examQs$.value;
      this.newExam.current = this.newExam.questions[0]._id;

      //get # of exams before updating 
      this.examService.getExams().subscribe(
        data => {
          this.newExam.number = data.length;
          this.examService.updateExam(exam._id || '', this.newExam)
        .subscribe({
            next: () => {
                  this.router.navigate(['/exam-time', exam._id]);
            },
            error: (e) => {
              alert(`Failed to update exam: ${exam._id}`);
              console.error(e);
            }
          });
        }
      );
    })

  // Optional TODO: add logic to grab more intelligently (unasked Qs, incorrect Qs, no repeats, etc) -> in question.services.ts

  /* This uses Subject<Question[]> instead of Question[].. not sure which is better yet
     this.questionService.getExamQuestions(options[0]).subscribe(res =>
     this.arr_questions.push(res));*/
  }
}
