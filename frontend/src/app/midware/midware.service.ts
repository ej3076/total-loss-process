import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MidwareService {

  constructor(private http: HttpClient) { }

  checkGet(){
    return this.http.get('https://reqres.in/api/users');
  }

  checkPost(){
    return this.http.post('http://localhost:8080', 'any');
  }

  checkPut(){
    return this.http.put('/home', 'any');
  }

  checkDelete(){
    return this.http.delete('/home');
  }
}
