import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-options',
  template: `
  <form class="exam-form" autocomplete="off" [formGroup]="examForm" (ngSubmit)="submitForm()">
    <h2 class="text-center m-5">Exam Options</h2>

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
          <form>
            <div>
              <div class="form-check form-switch">
                <button class="btn btn-primary mt-3" type="submit">Begin</button>
                <!--button class="btn btn-primary mt-3" [routerLink]="['examtime/']">Begin</button-->
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </form>
`,
  styles: [
  ]
})
export class OptionsComponent implements OnInit {
  @Output()
  formSubmitted = new EventEmitter<Exam>();

  details = false;
  qCount = 0;
  examForm: FormGroup = new FormGroup({});

  constructor(
    private examService: ExamService,
    private fb: FormBuilder
  ) {}
  //constructor(private fb: FormBuilder){}

  ngOnInit(): void{
    //TODO: get exams where questionCount = 0, if empty, createExam. else use retrieved entry.0
//    this.examService.createExam(this.examForm.value);
//    this.fetchQuestions();

    /*this.newExam.subscribe(exam => {
      this.examForm = this.fb.group({
        questions: exam.questions
      });
    });*/

  }

  private fetchQuestions(): void{
    // fetch list of previously answered questions + wrong questions
  }

  getQuestionCount(event:any){
    this.qCount = event.target.value;
    console.log(this.qCount);
  }

  toggleDetails(){
    this.details = !this.details;
    console.log(this.details);

  }

  submitForm(){
    this.formSubmitted.emit(this.examForm.value);
  }

}
