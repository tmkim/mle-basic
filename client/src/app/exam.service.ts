import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exam } from './exam';
import { Int32 } from 'mongodb';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private url = 'http://localhost:5200';
  private exams$: Subject<Exam[]> = new Subject();

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
  
  getExam(id: string): Observable<Exam> {
    return this.httpClient.get<Exam>(`${this.url}/exams/${id}`);
  }

  getEmptyExam(number: number): Observable<Exam> {
      return this.httpClient.get<Exam>(`${this.url}/exams/${number}`);
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
  
  updateExam(id: string, exam: Exam): Observable<string> {
    return this.httpClient.put(`${this.url}/exams/${id}`, exam, { responseType: 'text' });
  }
  
  deleteExam(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/exams/${id}`, { responseType: 'text' });
  }
 }
