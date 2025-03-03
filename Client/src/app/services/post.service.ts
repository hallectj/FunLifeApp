import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { IPostExcerpt } from '../models/shared-models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  public server_url = "https://fun-life-backend.onrender.com/api";
  //public server_url = "http://localhost:5000/api";

  constructor(private http: HttpClient) { }

  public getAllPosts(): Observable<IPostExcerpt[]>{
    const url = `${this.server_url}/posts`;
    return this.http.get<any>(url);
  }

  public getPost(postID: number, wantingHTML: boolean): Observable<IPostExcerpt | string | ArrayBuffer>{
    if(wantingHTML){
      const url = `${this.server_url}/posts/html/${postID}`;
      return this.http.get<string>(url, { responseType: 'text' as 'json' }).pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of(null);
          }
          return of(error);
        })
      );
    }
        
    const url = `${this.server_url}/posts/json/${postID}`;
    return this.http.get<IPostExcerpt>(url, { responseType: 'json' }).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(null);
        }
        return of(error);
      })
    );
  }
}