import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IMovie, ISong } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent {
  public monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  public dayEndings = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  public days: number[] = Array.from(Array(31).keys()).map(d => 1 + d);
  public years = Array.from(Array(2023 - 1940).keys()).map(year => 1940 + year);
  
  public selectedMonth: string = "January";
  public selectedDay: number = 1;
  public selectedYear: number = 1940;
  
  public dayEnd: number = 0;
  public showMedia: boolean = false;
  public birthdayDateStr: string = "on Your Birthday";

  public youTubeSongURL: SafeResourceUrl = "";
  public youTubeMovieURL: SafeResourceUrl = "";

  public songs: ISong[] = [];
  public movies: IMovie[] = [];

  public birthDaySong: ISong = {
    artist: "",
    endDate: new Date(),
    songTitle: "",
    startDate: new Date(),
    youtubeId: ""
  }

  public birthDayMovie: IMovie = {
    endDate: new Date(),
    movieTitle: "",
    startDate: new Date(),
    ticketPrice: 0,
    youtubeId: ""
  }


  constructor(public service: GeneralService, public sanitizer: DomSanitizer){}
  
  public async ngOnInit(){
    this.songs = await this.service.getSongs().toPromise();
    this.movies = await this.service.getMovies().toPromise();
  }

  public getMonth(){
    let idx = this.monthNames.findIndex(v => v === this.selectedMonth);
    if(idx !== -1){
      this.dayEnd = this.dayEndings[idx];
      this.days = Array.from(Array(this.dayEnd).keys()).map(d => 1 + d)
    }
  }

  public findMediaByDate<T extends ISong | IMovie>(mediaArr: T[], targetDate: Date): T | null{
    for (const item of mediaArr) {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);

      startDate.setHours(0, 0, 0);
      endDate.setHours(0, 0, 0);
      targetDate.setHours(0, 0, 0);
      //const targetTime = targetDate.getTime();
  
      if (targetDate.getTime() >= startDate.getTime() && targetDate.getTime() <= endDate.getTime()) {        
        return item;
      }
    }
  
    return null; // Return null if no matching song is found
  }

  public getBirthDateInfo(){
    const dateStr = this.selectedMonth + " " + this.selectedDay + ", " + this.selectedYear;
    const birthDate = new Date(this.formatDateToMMDDYYYY(dateStr));
    this.birthdayDateStr = dateStr;

    const songObj: ISong = this.findMediaByDate<ISong>(this.songs, birthDate);
    const movieObj: IMovie = this.findMediaByDate<IMovie>(this.movies, birthDate);

    if(songObj && movieObj){
      this.birthDaySong = songObj;
      this.youTubeSongURL = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + songObj.youtubeId);
      this.birthDayMovie = movieObj;
      this.youTubeMovieURL = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + movieObj.youtubeId);
    }else{
      this.birthDaySong = {songTitle: "", artist: "", youtubeId: "", startDate: new Date(), endDate: new Date()};
    }
    this.showMedia = true;

  }

  private formatDateToMMDDYYYY(inputDate: string) {
    const date = new Date(inputDate);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
  
    return `${month}/${day}/${year}`;
  }
}
