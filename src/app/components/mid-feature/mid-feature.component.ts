import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { IMovie } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'mid-feature',
  templateUrl: './mid-feature.component.html',
  styleUrls: ['./mid-feature.component.scss']
})
export class MidFeatureComponent {
  public popularMovie: IMovie = null;
  public youTubeURL: SafeResourceUrl;

  @Input() randomYear: string = "";

  constructor(public service: GeneralService, public sanitizer: DomSanitizer){}

  public async ngOnInit(){
    const movies = await lastValueFrom(this.service.getMovies());

    this.popularMovie = this.getMostPopularMovieByYear(movies, +this.randomYear);
    this.youTubeURL = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.popularMovie.youtubeId);
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
