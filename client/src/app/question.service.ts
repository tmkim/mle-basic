import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Question } from './question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private url = 'http://localhost:5200';
  private questions$: Subject<Question[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshQuestions() {
    this.httpClient.get<Question[]>(`${this.url}/questions`)
     .subscribe(questions => {
      this.questions$.next(questions);
    });
  }
  getQuestions(): Subject<Question[]> {
    this.refreshQuestions();
    return this.questions$;
  }

  // getExamQuestions(qCount: number): Subject<Question[]>{
  //   var buildQ$: Question[] = [];
  //   var rngCheck: any[] = [];
  //   var rng = 0;
  //   this.httpClient.get<Question[]>(`${this.url}/questions/`)
  //    .subscribe(questions => {      
  //     while(rngCheck.length < qCount){
  //       rng = Math.floor(Math.random() * (questions.length-1));
  //       if(!rngCheck.includes(rng)){
  //         rngCheck.push(rng);
  //         buildQ$.push(questions[rng]);
  //       }
  //     }
  //       this.questions$.next(buildQ$);
  //    })
  //   return this.questions$;
  // }
  
  getExamQuestions(qCount: number): Question[]{
    var buildQ$: Question[] = [];
    var rngCheck: any[] = [];
    var rng = 0;
    this.httpClient.get<Question[]>(`${this.url}/questions/`)
     .subscribe(questions => {      
      while(rngCheck.length < qCount){
        rng = Math.floor(Math.random() * (questions.length-1));
        if(!rngCheck.includes(rng)){
          rngCheck.push(rng);
          buildQ$.push(questions[rng]);
        }
      }
     })
    return buildQ$;
  }

  getQuestion(id: string): Observable<Question> {
    return this.httpClient.get<Question>(`${this.url}/questions/${id}`);
  }
  
  createQuestion(question: Question): Observable<string> {
    return this.httpClient.post(`${this.url}/questions`, question, { responseType: 'text' });
  }
  
  updateQuestion(id: string, question: Question): Observable<string> {
    return this.httpClient.put(`${this.url}/questions/${id}`, question, { responseType: 'text' });
  }
  
  deleteQuestion(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/questions/${id}`, { responseType: 'text' });
  }
 }