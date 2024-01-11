import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Building } from '../models/Building';

const baseUrl = 'http://localhost:5001/Building';
const buildingsLimit = 1000;

@Injectable({
  providedIn: 'root'
})

export class BuildingService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Building[]> {
    return this.http.get<Building[]>(`${baseUrl}/get-all-with-limit/${buildingsLimit}`);
  }

  get(id: bigint): Observable<Building> {
    return this.http.get<Building>(`${baseUrl}/get/${id}`);
  }

  create(data: any) : Observable<any> {
    return this.http.post(`${baseUrl}/add-new-range`, data).pipe(catchError(this.handleError));
  }

  update(data: Building[]): Observable<any> {
    return this.http.post(`${baseUrl}/update-range`, data).pipe(catchError(this.handleError));
  }

  delete(data: bigint[]): Observable<any> {
    return this.http.post(`${baseUrl}/remove-range`, data).pipe(catchError(this.handleError));
  }

  findByTitle(name: string): Observable<Building[]> {
    return this.http.get<Building[]>(`${baseUrl}/get-by-name/${name}`);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
