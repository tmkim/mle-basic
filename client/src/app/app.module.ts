import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExamsListComponent } from './exams-list/exams-list.component';
import { ExamTimeComponent } from './exam-time/exam-time.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { OptionsComponent } from './options/options.component';
import { BeginExamComponent } from './begin-exam/begin-exam.component';
import { FormsModule } from '@angular/forms';
import { ReviewExamComponent } from './review-exam/review-exam.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ExamsListComponent,
    ExamTimeComponent,
    OptionsComponent,
    BeginExamComponent,
    ReviewExamComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
