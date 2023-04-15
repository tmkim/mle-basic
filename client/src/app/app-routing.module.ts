import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamTimeComponent } from './exam-time/exam-time.component';
import { ExamsListComponent } from './exams-list/exams-list.component';
//import { OptionsComponent } from './options/options.component';
import { BeginExamComponent } from './begin-exam/begin-exam.component';
import { ReviewExamComponent } from './review-exam/review-exam.component';

const routes: Routes = [
 { path: '', redirectTo: 'exams', pathMatch: 'full' },
 { path: 'exams', component: ExamsListComponent },
 //{ path: 'exams/new-exam', redirectTo: 'new-exam', pathMatch: 'full' },
 { path: 'new-exam', component: BeginExamComponent },
 //{ path: 'options', component: OptionsComponent },
 //{ path: 'options/examtime', redirectTo: 'examtime', pathMatch: 'full' },
 { path: 'exam-time/:id', component: ExamTimeComponent },
 { path: 'review/:id', component: ReviewExamComponent }
];
 
@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }