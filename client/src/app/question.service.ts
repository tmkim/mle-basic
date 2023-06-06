import { Injectable } from '@angular/core';
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

  getQuestion(id: string): Observable<Question> {
    return this.httpClient.get<Question>(`${this.url}/questions/${id}`);
  }
  getExamQuestions(qOption: Option): Subject<Question[]>{
    var qCount = qOption.qCount
    const qPrio = qOption.flagPrio
    var q_ids: any[] = [];
    var buildQ$: Question[] = [];
    var rng = 0;
    var flag_qs: Question[] = [];
    var weight = 0;
    var filter_qs: Question[] = [];

    if (qPrio){
      // BELOW WORKS!!! above tries to use flagged table (for future use)
        this.httpClient.get<Question[]>(`${this.url}/questions/`)
        .subscribe(questions => {      
          //search list of Qs for flag, push id onto list + checklist
          flag_qs = questions.filter(q => q.flag == true);
          flag_qs.forEach(q => {
            buildQ$.push(q);
            q_ids.push(q._id)
          })

          //fill list until len(checklist) == question count
          //omit questions where id exists on checklist
          // while(q_ids.length < qCount!){
          //   rng = Math.floor(Math.random() * (questions.length));
          //   if(!q_ids.includes(questions[rng]._id)){
          //     q_ids.push(questions[rng]._id);
          //     buildQ$.push(questions[rng]);
          //   }
          // }

            var tmp_filter_qs = questions.filter(q => q.flag == false);
            filter_qs = tmp_filter_qs.filter(q => q.weight == weight);
            while(q_ids.length < qCount!){
              if(filter_qs.length < 1){
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
          /*
            filter_qs filters questions by weight (start at weight = 0)
            RNG based on filter_qs length
            if question is not in q_ids yet, add to list, remove question from filter list
            ** only remove flag=true from filter list when using flag prio
            if filter list runs out, increase weight by 1 and reset list
          */

          this.qList$.next(buildQ$);
        })
    }
    else{
      this.httpClient.get<Question[]>(`${this.url}/questions/`)
      .subscribe(questions => {      
        filter_qs = questions.filter(q => q.weight == weight);
        while(q_ids.length < qCount!){
          if(filter_qs.length < 1){
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

      //  while(rngCheck.length < qCount!){
      //    rng = Math.floor(Math.random() * (questions.length));
      //    if(!rngCheck.includes(rng)){
      //      rngCheck.push(rng);
      //      buildQ$.push(questions[rng]);
      //    }
      //  }
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