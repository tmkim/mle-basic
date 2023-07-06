import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Question } from './question';
import { Option } from './option';
import { environment } from './../environments/environment'
import { FlaggedService } from './flagged.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private url = environment.api_url;
  private questions$: Subject<Question[]> = new Subject();
  private qList$: Subject<Question[]> = new Subject();

  constructor(
    private httpClient: HttpClient,
    private flaggedService: FlaggedService
    ){}

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

  // getQuestion(id: string): Observable<Question> {
  //   return this.httpClient.get<Question>(`${this.url}/questions/${id}`);
  // }

  private refreshQsByEK(ek: string) {
    this.httpClient.get<Question[]>(`${this.url}/questions/${ek}`)
    .subscribe(questions => {
      this.questions$.next(questions);
    });
  }

  getQsByExamKey(ek: string): Subject<Question[]> {
    this.refreshQsByEK(ek)
    return this.questions$;
  }

  getExamQuestions(qOption: Option): Subject<Question[]>{
    var eK = qOption.examKey
    var qCount = qOption.qCount
    const qPrio = qOption.flagPrio
    var q_ids: any[] = [];
    var buildQ$: Question[] = [];
    var rng = 0;
    var ek_qs: Question[] = [];
    var flag_qs: Question[] = [];
    var weight = 0;
    var filter_qs: Question[] = [];

    if (qPrio){
      // BELOW WORKS!!! above tries to use flagged table (for future use)
        this.httpClient.get<Question[]>(`${this.url}/questions/`)
        .subscribe(questions => {      
          //search list of Qs for flag, push id onto list + checklist
          ek_qs = questions.filter(q => q.examKey == eK)
          flag_qs = ek_qs.filter(q => q.flag == true);
          flag_qs.forEach(q => {
            buildQ$.push(q);
            q_ids.push(q._id)
          })

            var tmp_filter_qs = questions.filter(q => q.flag == false);
            filter_qs = tmp_filter_qs.filter(q => q.weight == weight);
            while(q_ids.length < qCount!){
              while(filter_qs.length < 1){
                weight += 1;
                filter_qs = tmp_filter_qs.filter(q => q.weight == weight);
              }
              rng = Math.floor(Math.random() * (filter_qs.length));
              if(!q_ids.includes(filter_qs[rng]._id)){
                q_ids.push(filter_qs[rng]._id);
                buildQ$.push(filter_qs[rng]);
                filter_qs.splice(rng,1)
              }
            }
          this.qList$.next(buildQ$);
        })
    }
    else{
      this.httpClient.get<Question[]>(`${this.url}/questions/`)
      .subscribe(questions => {      

        // ********* testing images *************
        // var tmp_filter_qs = questions.filter(q => q.image != '');
        // while(q_ids.length < qCount!){
        //   if(tmp_filter_qs.length < 1){
        //     weight += 1;
        //     tmp_filter_qs = questions.filter(q => q.weight == weight);
        //   }
        //   rng = Math.floor(Math.random() * (tmp_filter_qs.length));
        //   if(!q_ids.includes(tmp_filter_qs[rng]._id)){
        //     q_ids.push(tmp_filter_qs[rng]._id);
        //     buildQ$.push(tmp_filter_qs[rng]);
        //     tmp_filter_qs.splice(rng,1)
        //   }
        // }
        ek_qs = questions.filter(q => q.examKey == eK)
        filter_qs = ek_qs.filter(q => q.weight == weight);
        while(q_ids.length < qCount!){
          while(filter_qs.length < 1){
            weight += 1;
            filter_qs = questions.filter(q => q.weight == weight);
          }
          rng = Math.floor(Math.random() * (filter_qs.length));
          if(!q_ids.includes(filter_qs[rng]._id)){
            q_ids.push(filter_qs[rng]._id);
            buildQ$.push(filter_qs[rng]);
            filter_qs.splice(rng,1)
          }
        }

       this.qList$.next(buildQ$);
      })
    }
    return this.qList$;
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