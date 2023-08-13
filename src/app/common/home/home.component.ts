import { Component } from '@angular/core';
import { HomeService } from './home.service';
import { IMovie } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';
import { combineLatest, lastValueFrom, map } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public randomYear: string = "1990";
  public popularMovie: IMovie = null;
  public youTubeURL: SafeResourceUrl;
  

  constructor(public service: GeneralService, public sanitizer: DomSanitizer){}

  public async ngOnInit(){
    this.randomYear = this.getRandomYear(1941, 2020).toString();
    const movies = await lastValueFrom(this.service.getMovies());

    this.popularMovie = this.getMostPopularMovieByYear(movies, +this.randomYear);
    this.youTubeURL = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.popularMovie.youtubeId);
    console.log(this.popularMovie);
    
  }

  //years from 1940 to 2020
  private getRandomYear(min: number, max: number): number {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }

  private getMostPopularMovieByYear(movies: IMovie[], year: number) {
    const moviesOfYear = movies.filter(movie => {
        const startYear = new Date(movie.startDate).getFullYear();
        const endYear = new Date(movie.endDate).getFullYear();
        return startYear <= year && endYear >= year;
    });

    if (moviesOfYear.length === 0) {
        return null; // No movies found for the given year
    }

    let mostPopularMovie = null;
    let maxDays = 0;

    moviesOfYear.forEach(movie => {
        const startDate = new Date(movie.startDate);
        const endDate = new Date(movie.endDate);
        const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        if (durationInDays > maxDays) {
            maxDays = durationInDays;
            mostPopularMovie = movie;
        }
    });

    return mostPopularMovie;
  }

}
