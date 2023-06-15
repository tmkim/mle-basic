import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { Option } from '../option';

@Component({
  selector: 'app-options',
  template: `
  <form class="options" autocomplete="off" [formGroup]="fg_optionsForm" (ngSubmit)="submitForm()">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col"></div>
        <div class="col-8">
          <form>
            <label for="formControlRange">Number of questions: </label>
            <div>
              <input type="range" value="100" min="1" max="200" oninput="this.nextElementSibling.value = this.value" (change)="getQuestionCount($event)">
              <output style="padding-left: 10px">100</output>
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
                <input class="form-check-input" type="checkbox" id="tog_details" (oninput)="toggleDetails()" (change)="toggleDetails()">
                <label class="form-check-label" for="tog_details">Show Answer Details</label>
              </div>
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
                <input class="form-check-input" type="checkbox" id="tog_flagPrio" (oninput)="toggleFlagPrio()" (change)="toggleFlagPrio()">
                <label class="form-check-label" for="tog_flagPrio">Prioritize Flagged Questions</label>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col"></div>
        <div class="col-8">
          <form>
            <label for="formControlRange">Time per question: </label>
            <div>
              <input type="range" value="72" min="1" max="144" oninput="this.nextElementSibling.value = this.value" (change)="getTimePerQ($event)">
              <output style="padding-left: 10px">72</output><span>&nbsp;seconds</span>
            </div>
          </form>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col"></div>
        <div class="col-5">
          <div>
            <div class="form-check form-switch">
              <button class="btn btn-primary mt-3" type="submit" [disabled]="!bs_exam$.value._id">Begin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
`,
  styles: [
  ]
})
export class OptionsComponent implements OnInit, OnDestroy {
  @Output()
  formSubmitted = new EventEmitter<Exam>();

  bs_exam$: BehaviorSubject<Exam> = new BehaviorSubject({});
  obs_exams$: Observable<Exam[]> = new Observable();
  obs_newExam: Observable<Exam> = new Observable();
  
  fg_optionsForm: FormGroup = new FormGroup({});
  obj_option: Option = { qCount: 100, details: false, flagPrio: false, timePerQ: 72};
  ctr_option: FormControl = new FormControl(this.obj_option);

  subscription_ce = new Subscription();
  
  constructor(
    private examService: ExamService,
    private fb: FormBuilder
  ) {}
  //constructor(private fb: FormBuilder){}

  ngOnInit(): void{
    this.examService.getEmptyExam().subscribe({
      next: (emptyExam) => {
        //console.log(emptyExam);
        this.bs_exam$.next(emptyExam);

        this.fg_optionsForm = this.fb.group({
          _id: emptyExam._id
        })
      },
      error: (e) => {
        console.log(`${e.error} -> Create new empty exam`)
        this.subscription_ce = this.examService.createEmptyExam().subscribe({
          next: () => {
            //console.log('added');
            this.examService.getEmptyExam().subscribe({
              next: (emptyExam) => {
                this.bs_exam$.next(emptyExam);        
                this.fg_optionsForm = this.fb.group({
                  _id: emptyExam._id
                })
              },
            })
          },
          error: (e) => {
            console.log(`${e.error}`)
          }
        });
      },
      complete: () => console.log('Empty Exam available')
    });
  }

  ngOnDestroy(): void {
    console.log('options unsubscribe')
    this.subscription_ce.unsubscribe()
  }

  getQuestionCount(event:any): void{
    this.obj_option.qCount = Number(event.target.value);
  }
  
  getTimePerQ(event:any): void{
    this.obj_option.timePerQ = Number(event.target.value);
  }

  toggleDetails(): void{
    this.obj_option.details = !this.obj_option.details;
  }

  toggleFlagPrio(): void{
    this.obj_option.flagPrio = !this.obj_option.flagPrio; 
  }

  submitForm(): void{
    this.fg_optionsForm.addControl('options', this.ctr_option);

    this.formSubmitted.emit(this.fg_optionsForm.value);
    
  }

}
