import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Favorite } from '@app/_models/favorite';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private apiUrl = 'http://localhost:4201/favorites';
  private userId = JSON.parse(localStorage.getItem('user')!).id;

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.apiUrl + `?userId=${this.userId}`);
  }

  addFavorites(movieId: number): Observable<any> {
    const body = {
      userId: this.userId,
      movieId: movieId,
    };
    return this.http.post(this.apiUrl, body);
  }

 
  
}
