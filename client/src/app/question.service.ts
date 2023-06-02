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

  // getExamQuestions(qCount: number): Subject<Question[]>{
  //   var buildQ$: Question[] = [];
  //   var rngCheck: any[] = [];
  //   var rng = 0;
  //   this.httpClient.get<Question[]>(`${this.url}/questions/`)
  //    .subscribe(questions => {      
  //     while(rngCheck.length < qCount){
  //       rng = Math.floor(Math.random() * (questions.length));
  //       if(!rngCheck.includes(rng)){
  //         rngCheck.push(rng);
  //         buildQ$.push(questions[rng]);
  //       }
  //     }
  //     this.qList$.next(buildQ$);
  //    })
  //   return this.qList$;
  // }


  getQuestion(id: string): Observable<Question> {
    return this.httpClient.get<Question>(`${this.url}/questions/${id}`);
  }
  getExamQuestions(qOption: Option): Subject<Question[]>{
    var qCount = qOption.qCount
    const qPrio = qOption.flagPrio
    var buildQ$: Question[] = [];
    var rngCheck: any[] = [];
    var rng_id: any[] = [];
    var rng = 0;
    var sub_get = new Subscription()

    if (qPrio){
      // this.flaggedService.getFlagged().subscribe(fList => {
      //   if (fList.length < qCount!){
      //     while (rngCheck.length < fList.length){
      //       rng = Math.floor(Math.random() * (fList.length));
      //       if(!rngCheck.includes(rng)){
      //         rngCheck.push(rng);
      //         // buildQ$.push(fList[rng]);
      //         this.getQuestion(fList[rng].q_id!).subscribe(q => {
      //           buildQ$.push(q);
      //         })
      //       }
      //     }
      //   }
      //   else{
      //     while (rngCheck.length < qCount!){
      //       rng = Math.floor(Math.random() * (fList.length));
      //       if(!rngCheck.includes(rng)){
      //         rngCheck.push(rng);
      //         buildQ$.push(fList[rng]);
      //         this.getQuestion(fList[rng].q_id!).subscribe(q => {
      //           buildQ$.push(q);
      //         })
      //       }
      //     }
      //   }

      this.flaggedService.getFlagged().subscribe(fList => {
        while (buildQ$.length < fList.length){
            // buildQ$.push(fList[rng]);
            sub_get = this.getQuestion(fList[rng].q_id!).subscribe(q => {
              buildQ$.push(q);
              sub_get.unsubscribe();
          })
        }
        console.log(buildQ$);
        qCount = qCount! - buildQ$.length
        this.httpClient.get<Question[]>(`${this.url}/questions/`)
        .subscribe(questions => {      
         while(rngCheck.length < qCount!){
           rng = Math.floor(Math.random() * (questions.length));
           if(!rngCheck.includes(rng) && !rng_id.includes(questions[rng]._id)){
             rngCheck.push(rng);
             rng_id.push(questions[rng]._id)
             buildQ$.push(questions[rng]);
           }
          //  console.log(buildQ$)
          //  console.log(rngCheck)
          //  console.log('---------')
         }
         this.qList$.next(buildQ$);
        })
      })
      return this.qList$;
    }
    else{
      this.httpClient.get<Question[]>(`${this.url}/questions/`)
      .subscribe(questions => {      
       while(rngCheck.length < qCount!){
         rng = Math.floor(Math.random() * (questions.length));
         if(!rngCheck.includes(rng)){
           rngCheck.push(rng);
           buildQ$.push(questions[rng]);
         }
       }
       this.qList$.next(buildQ$);
      })
      return this.qList$;
    }
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