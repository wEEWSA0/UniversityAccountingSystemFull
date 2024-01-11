import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Room } from '../models/Room';

const baseUrl = 'http://localhost:5002/Room';
const roomsLimit = 1000;

@Injectable({
  providedIn: 'root'
})

export class RoomService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(`${baseUrl}/get-all-with-limit/${roomsLimit}`);
  }

  get(id: bigint): Observable<Room> {
    return this.http.get<Room>(`${baseUrl}/get/${id}`);
  }

  create(data: any) : Observable<any> {
    return this.http.post(`${baseUrl}/add-new-range`, data).pipe(catchError(this.handleError));
  }

  update(data: Room[]): Observable<any> {
    return this.http.post(`${baseUrl}/update-range`, data).pipe(catchError(this.handleError));
  }

  delete(data: bigint[]): Observable<any> {
    return this.http.post(`${baseUrl}/remove-range`, data).pipe(catchError(this.handleError));
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
