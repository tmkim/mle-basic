import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import * as e from 'express';
import { async, asyncScheduler, BehaviorSubject, Observable, of } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-options',
  template: `
  <form class="options" autocomplete="off" [formGroup]="fg_optionsForm" (ngSubmit)="submitForm()">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col"></div>
        <div class="col-8">
          <form>
            <label for="formControlRange">Number of Questions: </label>
            <div>
              <input type="range" value="20" min="1" max="40" oninput="this.nextElementSibling.value = this.value" (change)="getQuestionCount($event)">
              <output>20</output>
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
      {{bs_exam$.value._id}}
    </div>
  </form>
`,
  styles: [
  ]
})
export class OptionsComponent implements OnInit {
  @Output()
  formSubmitted = new EventEmitter<Exam>();

  bs_exam$: BehaviorSubject<Exam> = new BehaviorSubject({});
  obs_exams$: Observable<Exam[]> = new Observable();
  obs_newExam: Observable<Exam> = new Observable();
  
  fg_optionsForm: FormGroup = new FormGroup({});
  bln_details = false;
  ctr_details: FormControl = new FormControl(this.bln_details);
  num_qCount = 20;
  ctr_qCount: FormControl = new FormControl(this.num_qCount);
  
  constructor(
    private examService: ExamService,
    private fb: FormBuilder
  ) {}
  //constructor(private fb: FormBuilder){}

  ngOnInit(): void{
    this.examService.getEmptyExam(-1).subscribe({
      next: (emptyExam) => {
        console.log(emptyExam);
        this.bs_exam$.next(emptyExam);

        this.fg_optionsForm = this.fb.group({
          _id: emptyExam._id
        })
      },
      error: (e) => {
        console.log(`${e.error} -> Create new empty exam`)
        //this.examService.createEmptyExam();
      },
      complete: () => console.log('Empty Exam available')
    });

    /*this.examService.getEmptyExam(-1).subscribe((emptyExam) => {
      this.bs_exam$.next(emptyExam);
      //this.obs_newExam = emptyExam;
      console.log(this.bs_exam$.value);
    },
    err => {
      console.log("Empty Exam does not exist -> create new empty exam");
//        this.examService.createExam(this.examForm.value)
    });*/

  }

    //this.obs_exams$.
//    
//    this.fetchQuestions();

    /*this.obs_newExam.subscribe(exam => {
      this.examForm = this.fb.group({
        questions: exam.questions
      });
    });*/

  private fetchQuestions(): void{
    // fetch list of previously answered questions + wrong questions
  }

  getQuestionCount(event:any): void{
    this.num_qCount = event.target.value;
    this.ctr_qCount.setValue(this.num_qCount);
    console.log(this.num_qCount);
  }

  toggleDetails(): void{
    this.bln_details = !this.bln_details;
    this.ctr_details.setValue(this.bln_details);
    console.log(this.bln_details);
  }

  submitForm(): void{
    //this.fg_optionsForm.addControl('bln_details', this.ctr_details);
    //this.fg_optionsForm.addControl('num_qCount', this.ctr_qCount);
    var ctr_options: FormArray = new FormArray([this.ctr_qCount, this.ctr_details]);
    this.fg_optionsForm.addControl('options', ctr_options);

    //console.log("Submit!");
    //console.log(this.fg_optionsForm.value);
    this.formSubmitted.emit(this.fg_optionsForm.value);
    
  }

}
