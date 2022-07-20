import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from './user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignupFormService {

  constructor(private http: HttpClient) {}

  addUser$(data: User): Observable<User> {
    return this.http.post<User>(environment.apiUrl, data);
  }
}
