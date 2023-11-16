import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  public handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      return of(error.error);
    } else if(error.status === 404) {
      return of(`Backend returned code ${error.status}, body was: `, error.error);
    }else{
      return of(`error returned with code ${error.status}, with error ${error.error}`);
    }
  }

  constructor() { }
}
