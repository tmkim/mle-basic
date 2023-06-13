import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Flagged } from './flagged';
import { environment } from './../environments/environment'
import { ObjectId } from 'mongodb';

@Injectable({
  providedIn: 'root'
})
export class FlaggedService {
  private url = environment.api_url;
  private questions$: Subject<Flagged[]> = new Subject();
  private flaggedQ$: Subject<Flagged> = new Subject();
  private numFlags = 0;

  constructor(private httpClient: HttpClient) { }

  private refreshFlagged() {
    this.httpClient.get<Flagged[]>(`${this.url}/flagged`)
     .subscribe(questions => {
      this.questions$.next(questions);
      this.numFlags = questions.length;
    });
  }

  getFlagged(): Subject<Flagged[]> {
    this.refreshFlagged();
    return this.questions$;
  }

  createFlagged(fq_id: string): Observable<string> {
    // var flag_id = new ObjectId

    this.refreshFlagged()

    var question: Flagged = {
      q_id: fq_id,
    }
    // console.log(question)
    return this.httpClient.post(`${this.url}/flagged`, question, { responseType: 'text' });
  }
  
  updateFlagged(id: string, question: Flagged): Observable<string> {
    return this.httpClient.put(`${this.url}/flagged/${id}`, question, { responseType: 'text' });
  }
  
  deleteFlagged(fq_id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/flagged/${fq_id}`, { responseType: 'text' });
  }



 }