import { Component } from '@angular/core';

@Component({
  selector: 'app-exam-time',
  template: `
  <h2 class="text-center m-5" num=1>Question {{num}}</h2>
  <div class="container">
    <div class="row">
      <div class="col">
        <p>Question text</p>  
      </div>
    </div>
    <div class="form-check">
      <div class="row-1">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
          <label class="form-check-label" for="flexRadioDefault1">
          Answer Choice 1
          </label>
      </div>
      <div class="row-2">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
        <label class="form-check-label" for="flexRadioDefault2">
        Answer Choice 2
        </label>
      </div>
      <div class="row-3">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
        <label class="form-check-label" for="flexRadioDefault3">
        Answer Choice 3
        </label>
      </div>
      <div class="row-4">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4">
        <label class="form-check-label" for="flexRadioDefault4">
        Answer Choice 4
        </label>
      </div>
    </div>
    <div></div>
    <div class="row">
      <div class="col">
        <div class="form-check form-switch">
          <button class="btn btn-primary mt-3" [routerLink]="['prev']"> <-- Previous</button>
        </div>
      </div>
      <div class="col">
       <div class="form-check form-switch">
          <button class="btn btn-primary mt-3" [routerLink]="['next']">Next --></button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
  ]
})
export class ExamTimeComponent {
  num = 1;
}
