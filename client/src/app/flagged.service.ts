import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Flagged } from './flagged';

@Injectable({
  providedIn: 'root'
})
export class FlaggedService {
//   private url = 'http://localhost:5200';
  private url = 'https://mle-basic-server.vercel.app';
  private questions$: Subject<Flagged[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshFlagged() {
    this.httpClient.get<Flagged[]>(`${this.url}/questions`)
     .subscribe(questions => {
      this.questions$.next(questions);
    });
  }

  getFlagged(): Subject<Flagged[]> {
    this.refreshFlagged();
    return this.questions$;
  }

  createFlagged(question: Flagged): Observable<string> {
    return this.httpClient.post(`${this.url}/questions`, question, { responseType: 'text' });
  }
  
  updateFlagged(id: string, question: Flagged): Observable<string> {
    return this.httpClient.put(`${this.url}/questions/${id}`, question, { responseType: 'text' });
  }
  
  deleteFlagged(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/questions/${id}`, { responseType: 'text' });
  }
 }