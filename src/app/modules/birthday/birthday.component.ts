import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LOADINGSPINNER } from 'src/app/common/base64Assests';
import { ICelebCard, ICelebrity, IFamousBirths, IHistEvent, IMovie, IPostExcerpt, IPresident, ISong, ISport } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';
@Component({
  selector: 'birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent {
  public imageNotFound: string = "src/assets/image-not-found-icon.png";
  public monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  public dayEndings = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  public days: number[] = Array.from(Array(31).keys()).map(d => 1 + d);
  public years = Array.from(Array(2023 - 1940).keys()).map(year => 1940 + year);
  
  public selectedMonth: string = "January";
  public selectedDay: number = 1;
  public selectedYear: number = 1940;

  public lockedInMonthAndDay: string = "on Your Birthday";
  public presidentNumberOrdinal: string = ""  //ie 44th or 23rd or 41st
  
  public dayEnd: number = 0;
  public showMedia: boolean = false;
  public showCelebs: boolean = false;
  public showPresident: boolean = false;
  public showHistEvents: boolean = false;
  public showSports: boolean = false;
  public birthdayDateStr: string = "";

  public youTubeSongURL: SafeResourceUrl = "";
  public youTubeMovieURL: SafeResourceUrl = "";

  public songs: ISong[] = [];
  public movies: IMovie[] = [];

  public historyEvents: IHistEvent[] = [];
  public famousBirths: IFamousBirths[] = [];
  public sports: ISport[] = [];

  public dispHistory: {post: IPostExcerpt, useRibbon: boolean, year: number}[] = [];

  public currentPresident: IPresident = {
    number: '',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    portraitURL: '',
    portraitDesc: '',
    portraitSource: ''
  }

  public cards: ICelebCard[] = [];

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

  public footballObj: ISport;
  public basketballObj: ISport;
  public baseballObj: ISport;
  public hockeyObj: ISport;

  public sportImages = [
    '../../assets/football_pic.jpg',
    '../../assets/baseball_pic.jpg',
    '../../assets/hockey_pic.jpg',
    '../../assets/basketball_pic.jpg'
  ]
  
  @ViewChildren('sportCards') sportCards!: QueryList<ElementRef<HTMLElement>>;

  constructor(public service: GeneralService, public sanitizer: DomSanitizer){}
  
  public async ngOnInit(){
    //this.cards = this.createDummyCards(3, "large", 3);
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

  public async getBirthDateInfo(){
    this.showMedia = false;
    this.showCelebs = false;
    this.showPresident = false;
    this.showHistEvents = false;
    this.showSports = false;

    const dateStr = this.selectedMonth + " " + this.selectedDay + ", " + this.selectedYear;

    const dd = this.selectedDay.toString().padStart(2, "0"), yyyy = this.selectedYear.toString().padStart(2, "0");

    const birthDate = new Date(this.formatDateToMMDDYYYY(dateStr));
    const mm = (birthDate.getMonth() + 1).toString().padStart(2, "0");
    this.birthdayDateStr = dateStr;

    this.lockedInMonthAndDay = this.selectedMonth + ' ' + this.selectedDay;

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
    this.showCelebs = true;
    this.cards = this.createDummyCards(3, "large", 3);

    this.historyEvents = await this.service.getEvents(birthDate).toPromise();
    this.dispHistory = this.historyEvents.map((v: IHistEvent) => (
      {
        post: {
          excerptDesc: v.description,
          excerptImage: v.imageURL, 
          excerptTitle: v.title,
          isFeaturePost: false
        }, 
        useRibbon: true,
        year: v.year
      }
    ));

    this.showHistEvents = true;

    this.sports = await this.service.getSportsByYear(birthDate.getFullYear().toString()).toPromise();
    this.showSports = true;   

    const presidents: IPresident[] = await this.service.getPresidents().toPromise();
    const thePresident = this.findObjectByDate(presidents, birthDate);
    if(thePresident){
      this.currentPresident = thePresident;
      this.presidentNumberOrdinal = this.getOrdinal(+this.currentPresident.number);
    }

    this.showPresident = true;

    //celebs
    this.famousBirths = await this.service.getFamousPeopleByDate(mm, dd, "", 9).toPromise();
    this.famousBirths = this.famousBirths.filter((e, i) => this.famousBirths.findIndex(a => a.personLabel === e.personLabel) === i);

    this.famousBirths = this.famousBirths.filter((v: IFamousBirths) =>
      v.occupations.every((occ) => !this.service.containsBadWord(occ)));

    this.cards = [];

    for(let i = 0; i<this.famousBirths.length; i++){
      const c: IFamousBirths = this.famousBirths[i];
      const obj: ICelebCard = {
        size: "large",
        medalColor: "gold",
        image: c.image,
        showSkills: true,
        celebPopularity: i+1,
        celebInfo: {name: c.personLabel, age: this.computeAge(new Date(c.birthdate)), occupations: c.occupations.splice(0, 4)}
      }
      this.cards.push(obj);
    }

    this.showCelebs = true;


    const sArr = this.sportCards.toArray();
    for(let i = 0; i<sArr.length; i++){
      const element = sArr[i].nativeElement as HTMLElement;
      element.style.setProperty('--bg-image', `url(${this.sportImages[i]})`);
    }

  }

  private createDummyCards(len: number, size: string, dispAmt: number) : ICelebCard[] {
    //create dummy cards first so something is on the page
    let dummyCard: ICelebCard[] = [];

    for(let i = 0; i<len; i++){
      const obj: ICelebCard = {
        size: size,
        medalColor: "gold",
        image: LOADINGSPINNER,
        showSkills: true,
        celebPopularity: 0,
        celebInfo: {name: "LOADING", age: 0, occupations: []}
      }
      dummyCard.push(obj);
    }
    return dummyCard.splice(0, dispAmt)
  }

  public getOrdinal(number: number) {
    if (10 <= number % 100 && number % 100 <= 20) {
        return number + "th";
    } else {
        const lastDigit = number % 10;
        const suffixes = { 1: "st", 2: "nd", 3: "rd" };
        const suffix = suffixes[lastDigit] || "th";
        return number + suffix;
    }
  }

  private findObjectByDate(array: IPresident[], dateToFind: Date) {
    for (const obj of array) {
      const startDate = obj.startDate;
      const endDate = obj.endDate;
  
      if (dateToFind >= startDate && dateToFind <= endDate) {
        return obj;
      }
    }
  
    return null;
  }

  private formatDateToMMDDYYYY(inputDate: string) {
    const date = new Date(inputDate);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
  
    return `${month}/${day}/${year}`;
  }

  private computeAge(dateOfBirth: Date){
    let currentDate = new Date();
    let birthDate = new Date(dateOfBirth);
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    
    // Check if the birthday has occurred this year
    if (currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
