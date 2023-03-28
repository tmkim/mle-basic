import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as e from 'express';
import { async, asyncScheduler, BehaviorSubject, Observable, of } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-options',
  template: `
  <form class="options" autocomplete="off" [formGroup]="optionsForm" (ngSubmit)="submitForm()">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col"></div>
        <div class="col-8">
          <form>
            <label for="formControlRange">Number of Questions: </label>
            <div>
              <input type="range" value="40" min="1" max="100" oninput="this.nextElementSibling.value = this.value" (change)="getQuestionCount($event)">
              <output>40</output>
            </div>
          </form>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col"></div>
        <div class="col-8">
          <form>
            <div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" (oninput)="toggleDetails()" (change)="toggleDetails()">
                <label class="form-check-label" for="flexSwitchCheckDefault">Show Answer Details</label>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col"></div>
        <div class="col-5">
          <div>
            <div class="form-check form-switch">
              <button class="btn btn-primary mt-3" type="submit">Begin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      {{exam$.value._id}}
    </div>
  </form>
`,
  styles: [
  ]
})
export class OptionsComponent implements OnInit {
  @Output()
  formSubmitted = new EventEmitter<Exam>();

  exam$: BehaviorSubject<Exam> = new BehaviorSubject({});
  exams$: Observable<Exam[]> = new Observable();
  newExam: Observable<Exam> = new Observable();
  
  optionsForm: FormGroup = new FormGroup({});
  details = false;
  qCount = 0;

  constructor(
    private examService: ExamService,
    private fb: FormBuilder
  ) {}
  //constructor(private fb: FormBuilder){}

  ngOnInit(): void{
    this.examService.getEmptyExam(-1).subscribe({
      next: (emptyExam) => {
        console.log(emptyExam);
        this.exam$.next(emptyExam);

        this.optionsForm = this.fb.group({
          _id: [emptyExam._id]
        })
      },
      error: (e) => {
        console.log(`${e.error} -> Create new empty exam`)
        //this.examService.createExam();
      },
      complete: () => console.log('Empty Exam available')
    });

    /*this.examService.getEmptyExam(-1).subscribe((emptyExam) => {
      this.exam$.next(emptyExam);
      //this.newExam = emptyExam;
      console.log(this.exam$.value);
    },
    err => {
      console.log("Empty Exam does not exist -> create new empty exam");
//        this.examService.createExam(this.examForm.value)
    });*/

  }

    //this.exams$.
//    
//    this.fetchQuestions();

    /*this.newExam.subscribe(exam => {
      this.examForm = this.fb.group({
        questions: exam.questions
      });
    });*/

  private fetchQuestions(): void{
    // fetch list of previously answered questions + wrong questions
  }

  getQuestionCount(event:any){
    this.qCount = event.target.value;
    console.log(this.qCount);

    this.optionsForm.setValue({
      qCount: [this.qCount]
    });
  }

  toggleDetails(){
    this.details = !this.details;
    console.log(this.details);
    this.optionsForm.addControl('details_flag', this.details);
//    this.optionsForm?.addControl('control-name', new FormControl('', [Validators.required])
    /*this.optionsForm.setValue({
      _id: this.exam$.value._id,
      details_flag: [this.details]
    });*/
  }

  submitForm(){
    console.log("Submit!");
    this.formSubmitted.emit(this.optionsForm.value);
  }

}
