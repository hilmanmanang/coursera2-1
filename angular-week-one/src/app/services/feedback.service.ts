import { Injectable } from '@angular/core';
import { Feedback, ContactType} from '../shared/feedback';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) { }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(baseURL + 'feedback').pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeedback(firstname: string): Observable<Feedback> {
    return this.http.get<Feedback>(baseURL + 'feedback/' + firstname).pipe(catchError(this.processHTTPMsgService.handleError));
  }

  pushFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'dishes/', feedback, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError))
  }
}

