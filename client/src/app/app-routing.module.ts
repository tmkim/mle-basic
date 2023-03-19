import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamTimeComponent } from './exam-time/exam-time.component';
import { ExamsListComponent } from './exams-list/exams-list.component';
import { OptionsComponent } from './options/options.component';
 
const routes: Routes = [
 { path: '', redirectTo: 'exams', pathMatch: 'full' },
 { path: 'exams', component: ExamsListComponent },
 { path: 'exams/options', redirectTo: 'options', pathMatch: 'full' },
 { path: 'options', component: OptionsComponent },
 { path: 'options/examtime', redirectTo: 'examtime', pathMatch: 'full' },
 { path: 'examtime', component: ExamTimeComponent },
];
 
@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }