import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { MovieService } from '@app/_services/movies.service';
import { Movie } from '@app/_models/movie';
import { Favorite } from '@app/_models/favorite';
import { FavoritesService } from '@app/_services/favorites.service';
import { map, subscribeOn, take } from 'rxjs';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  user: User | null;

  movies: Movie[] = [];
  favoriteMovies: Set<Movie | null>;
  constructor(
    private accountService: AccountService,
    private movieService: MovieService,
    private favoritesService: FavoritesService
  ) {
    this.user = this.accountService.userValue;
    this.favoriteMovies = new Set();
  }
  ngOnInit(): void {
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        console.log(data);
        this.movies = data;
        this.favoritesService
          .getFavorites()
          .pipe(
            map((favorites: Favorite[]) => {
              return favorites.map((favorite: Favorite) => {
                return (
                  data.find((m: Movie) => m.id === favorite.movieId) || null
                );
              });
            })
          )
          .subscribe({
            next: (favoriteMovies: (Movie | null)[]) => {
              console.log(favoriteMovies);
              const arrMovies = favoriteMovies.filter(
                (movie: Movie | null) => movie !== null
              );
              this.favoriteMovies = new Set(arrMovies);
            },
            error: (error) => {
              console.error(error);
            },
            complete: () => {},
          });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  addFavorite(movieId: number) {
    let subcription = this.favoritesService
      .addFavorites(movieId)
      .subscribe(() => {
        this.favoritesService
          .getFavorites()
          .pipe(
            map((favorites: Favorite[]) => {
              return favorites.map((favorite: Favorite) => {
                return (
                  this.movies.find((m: Movie) => m.id === favorite.movieId) ||
                  null
                );
              });
            })
          )
          .subscribe({
            next: (favoriteMovies: (Movie | null)[]) => {
              console.log(favoriteMovies);
              const arrMovies = favoriteMovies.filter(
                (movie: Movie | null) => movie !== null
              );
              this.favoriteMovies = new Set(arrMovies);

              subcription.unsubscribe();
            },
            error: (error) => {
              console.error(error);
            },
            complete: () => {},
          });
      });
  }
}
