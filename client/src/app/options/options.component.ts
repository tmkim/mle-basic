import { Component } from '@angular/core';

@Component({
  selector: 'app-options',
  template: `
  <h2 class="text-center m-5">Exam Options</h2>

  <div class="container">
    <div class="row justify-content-center">
      <div class="col"></div>
      <div class="col-8">
        <form>
          <label for="formControlRange">Number of Questions: </label>
          <div>
            <input type="range" value="40" min="1" max="100" oninput="this.nextElementSibling.value = this.value">
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
              <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
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
              <button class="btn btn-primary mt-3" [routerLink]="['examtime']">Begin</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
`,
  styles: [
  ]
})
export class OptionsComponent {

}
