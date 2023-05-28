import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Exam } from './exam';
import { environment } from './../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private url = environment.api_url;
  private exams$: Subject<Exam[]> = new Subject();
  newExam: Exam = {
    number: -1
  };

  constructor(private httpClient: HttpClient) { }

  private refreshExams() {
    this.httpClient.get<Exam[]>(`${this.url}/exams`)
     .subscribe(exams => {
      this.exams$.next(exams);
    }); 
  }
  getExams(): Subject<Exam[]> {
    this.refreshExams();
    return this.exams$;
  }

  getNumExams(): Observable<Exam[]>{
    this.httpClient.get<Exam[]>(`${this.url}/exams`)
    .subscribe(exams => {
      this.exams$.next(exams);
   });
    return this.exams$;
  }
  
  getExam(id: string): Observable<Exam> {
    return this.httpClient.get<Exam>(`${this.url}/exams/${id}`);
  }

  getEmptyExam(): Observable<Exam> {
      return this.httpClient.get<Exam>(`${this.url}/exams/-1`);
    /*return this.httpClient.get<Exam>(`${this.url}/exams/${number}`).pipe(map(res => {
      if(res.status == 404) {
        console.log("404");
         throw new Error('This request has failed ' + res.status);
      } 
     else {
      console.log("nop"); 
        return res.json();
     }
    }));*/
  }
  
  createExam(exam: Exam): Observable<string> {
    return this.httpClient.post(`${this.url}/exams`, exam, { responseType: 'text' });
  }

  createEmptyExam(): Observable<string> {
    var exam = {
      number: -1,
    };
    return this.httpClient.post(`${this.url}/exams`, exam, { responseType: 'text' });
  }
  
  updateExam(id: string, exam: Exam): Observable<string> {
    return this.httpClient.put(`${this.url}/exams/${id}`, exam, { responseType: 'text' });
  }

  updateExamNums(): Subject<Exam[]> {
    var ex_count = 0
    var tmp_exams$ = new Subject<Exam[]>();
    this.httpClient.get<Exam[]>(`${this.url}/exams`).subscribe(exams => {
      tmp_exams$.next(exams);
    });

    tmp_exams$.forEach(exams => {
      exams.forEach(exam =>{
        ex_count++;
        this.newExam.number = ex_count;
        this.updateExam(exam._id!, this.newExam).subscribe({next:() => {
          // console.log(res)
          this.refreshExams();
          // console.log(this.exams$);
        }})
      })
    });
    this.refreshExams();
      //     if(!this.exams$)
      // this.exams$ = tmp_exams$;

    return this.exams$;
  }
  
  deleteExam(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/exams/${id}`, { responseType: 'text' });
  }
 }
