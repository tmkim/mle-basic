import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Exam } from './exam';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private url = 'http://localhost:5200';
  private exams$: Subject<Exam[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshExams() {
    this.httpClient.get<Exam[]>('${this.url}/exam')
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

  getEmptyExam(time: string): Observable<Exam> {
    return this.httpClient.get<Exam>(`${this.url}/exams/${time}`);
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
