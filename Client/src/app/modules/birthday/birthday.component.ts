import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { slugify } from '../../../../src/app/common/Toolbox/util';
import { LOADINGSPINNER } from '../../../../src/app/common/base64Assests';
import { ICelebCard, ICelebrity, IHistEvent, IMovie, IPostExcerpt, IPresident, ISong, ISong2, ISport } from '../../../../src/app/models/shared-models';
import { GeneralService } from '../../../../src/app/services/general.service';
import { firstValueFrom } from 'rxjs';
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

  public youTubeSongURL: string = "";
  public youTubeMovieURL: string = "";

  public songs: ISong[] = [];
  public movies: IMovie[] = [];

  public historyEvents: IHistEvent[] = [];
  public selectedHistoryEvent: IHistEvent = {
    description: "",
    year: 100, 
    imageURL: "",
    wikiURL: "",
    title: "",
    noImageFound: true    
  }
  public famousBirths: ICelebrity[] = [];
  public sports: ISport[] = [];

  public dispHistory: {post: IPostExcerpt, useRibbon: boolean, year: number}[] = [];

  public currentPresident: IPresident = {
    number: '',
    name: '',
    startDate: '',
    endDate: '',
    portraitURL: '',
    portraitDesc: '',
    portraitSource: '',
    party: '',
    birthCity: '',
    birthStateAbbr: '',
    birthdate: '',
    spouses: []
  }

  public cards: ICelebCard[] = [];

  public birthDaySong: ISong = {
    artist: "",
    endDate: new Date(),
    songTitle: "",
    startDate: new Date(),
    youtubeId: ""
  }

  public birthdate: Date = new Date();

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
  ];

  public yearlySongs: ISong[] = [];
  public showYearlySongs: boolean = false;
  public isYearlySongsExpanded: boolean = false;
  
  @ViewChildren('sportCards') sportCards!: QueryList<ElementRef<HTMLElement>>;

  constructor(
    public service: GeneralService, 
    public sanitizer: DomSanitizer, 
    private router: Router,
    private title: Title,
    private meta: Meta
  ){}
  
  public isLeapYear(year: number){
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }

  public async ngOnInit(){
    // Update title to be more direct and engaging
    this.title.setTitle("What Was the #1 Song on Your Birthday | Which celebrity was born same day as you?");    
    // Update keywords to target more specific long-tail phrases
    this.meta.updateTag({name: "keywords", content: "number one song on my birthday, what song was number 1 when i was born, birthday number one hit, top song on birthday, birthday song finder, find the number one song on my birthday, find number one song on your birthday"});
    
    // Enhance social sharing meta tags
    this.meta.updateTag({property: "og:title", content: "What Was the #1 Song on Your Birthday? | Find out which celebrity was born on the same day as you."});
    this.meta.updateTag({property: "og:description", content: "Enter your birthday to instantly discover the #1 song on your birthday! Also you can explore top #1 song every year on your birthday too."});
    this.meta.updateTag({property: "og:type", content: "website"});
    
    // Add Twitter Card tags with engaging content
    this.meta.updateTag({name: "twitter:card", content: "summary_large_image"});
    this.meta.updateTag({name: "twitter:title", content: "Discover the #1 Song from the Day You Were Born"});
    this.meta.updateTag({name: "twitter:description", content: "Find your birthday song instantly! Enter your birth date to see what topped the charts when you were born. #MyBirthdaySong"});
    this.meta.updateTag({name: "twitter:description", content: "Discover what was the #1 song on your birthday and which celebrities were born on the same day."});
    
    this.songs = await firstValueFrom(this.service.getNumberOneHitSongs());
    this.movies = await firstValueFrom(this.service.getMovies());

    this.birthdate = this.service.getBirthDate();
    if(!!this.birthdate && this.service.hasBirthdayBtnClickedBefore){
      this.selectedMonth = this.monthNames[this.birthdate.getMonth()]; 
      this.selectedDay = this.birthdate.getDate(); 
      this.selectedYear = this.birthdate.getFullYear();
      await this.callAPIs(this.birthdate);
    }
  }

  public getMonth(){
    let idx = this.monthNames.findIndex(v => v === this.selectedMonth);
    if(idx !== -1){
      if(this.selectedMonth === "February" && this.isLeapYear(this.selectedYear)){
        this.dayEndings[idx] = 29;
      }else{
        this.dayEndings[1] = 28;
      }
      this.dayEnd = this.dayEndings[idx];
      this.days = Array.from(Array(this.dayEnd).keys()).map(d => 1 + d)
    }
  }

  public updateDaySelectionIfLeapYear(){
    const isLeap = this.isLeapYear(this.selectedYear);
    if(this.selectedMonth === "February" && isLeap){
      this.dayEndings[1] = 29;
      this.dayEnd = this.dayEndings[1];
    }else{
      this.dayEndings[1] = 28;
      this.dayEnd = this.dayEndings[this.monthNames.findIndex(v => v === this.selectedMonth)];
    }
    this.days = Array.from(Array(this.dayEnd).keys()).map(d => 1 + d)    
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
    const birthDate = new Date(this.formatDateToMMDDYYYY(dateStr));
    this.service.setBirthDate(birthDate);
    this.service.hasBirthdayBtnClickedBefore = true;

    await this.callAPIs(birthDate)
  }

  public async callAPIs(birthDate: Date){
    const dateStr = this.selectedMonth + " " + this.selectedDay + ", " + this.selectedYear;
    const dateset = (birthDate.getMonth() + 1).toString().padStart(2, "0") + "-" + (birthDate.getDate()).toString().padStart(2, "0");
    this.birthdayDateStr = dateStr;
    this.lockedInMonthAndDay = this.selectedMonth + ' ' + this.selectedDay;
    const songObj: ISong = this.findMediaByDate<ISong>(this.songs, birthDate);
    const movieObj: IMovie = this.findMediaByDate<IMovie>(this.movies, birthDate);

    if(songObj && movieObj){
      this.birthDaySong = songObj;
      this.birthDayMovie = movieObj;
      this.getYouTubeURLs();
    }else{
      this.birthDaySong = {songTitle: "", artist: "", youtubeId: "", startDate: new Date(), endDate: new Date()};
    }

    // Get songs for each year on the same month/day
    this.getYearlySongs(birthDate);
    
    this.showMedia = true;
    this.showCelebs = true;
    this.cards = this.createDummyCards(3, "large", 3);

    this.historyEvents = await firstValueFrom(this.service.getEvents(birthDate));
    this.dispHistory = this.historyEvents.map((v: IHistEvent) => (
      {
        post: {
          postId: -1,
          excerptDesc: v.description,
          excerptImage: v.imageURL,
          excerptImageB64: "", 
          excerptTitle: v.title,
          isFeaturePost: false,
          author: "",
          dateWritten: null,
          lastUpdated: null,
          pointer: "",
          attribution: {
            license: "",
            author: "",
            imageURL: "",
            via: ""
          }
        }, 
        useRibbon: true,
        year: v.year
      }
    ));

    this.showHistEvents = true;

    this.sports = await firstValueFrom(this.service.getSportsByYear(birthDate.getFullYear().toString()));
    this.showSports = true;   

    const presidents: IPresident[] = await firstValueFrom(this.service.getPresidents());
    const thePresident = this.findObjectByDate(presidents, birthDate);
    if(thePresident){
      this.currentPresident = thePresident;
      this.presidentNumberOrdinal = this.getOrdinal(+this.currentPresident.number);
    }

    this.showPresident = true;

    //this.famousBirths = await this.service.getCelebrityBirths(new Date(birthDate), false).toPromise() as ICelebrity[];

    this.famousBirths = await firstValueFrom(this.service.getCelebrityByDateSet(dateset));

    this.famousBirths = this.famousBirths.filter((v: ICelebrity) =>
      v.occupations.every((occ) => !this.service.containsBadWord(occ)));

    this.cards = [];

    for(let i = 0; i<this.famousBirths.length; i++){
      const c: ICelebrity = this.famousBirths[i];
      const obj: ICelebCard = {
        size: "large",
        medalColor: "gold",
        image: c.image,
        showSkills: true,
        celebPopularity: i+1,
        celebInfo: {name: c.name, age: this.computeAge(new Date(c.birthdate)), occupations: c.occupations.splice(0, 4)}
      }
      this.cards.push(obj);
    }

    this.showCelebs = true;


    const sArr = this.sportCards.toArray();
    for(let i = 0; i<sArr.length; i++){
      const element = sArr[i].nativeElement as HTMLElement;
      element.style.setProperty('--bg-image', `url(${this.sportImages[i]})`);
    }
    
    // At the end of the method, after all data is loaded
    this.addStructuredData();
    
    // After data is loaded and processed
    if(songObj && movieObj){
      // Update title and meta tags with specific date information
      const formattedDate = `${this.selectedMonth} ${this.selectedDay}, ${this.selectedYear}`;
      this.title.setTitle(`#1 Song on ${formattedDate} was ${songObj.songTitle} by ${songObj.artist}`);
      this.meta.updateTag({name: "description", content: `The number one song on ${formattedDate} was ${songObj.songTitle} by ${songObj.artist}. Discover more about your birthday including famous people born on ${this.selectedMonth} ${this.selectedDay}.`});
      
      // Update structured data with specific song information
      this.addStructuredDataWithSong(songObj, formattedDate);
    }
  }

  public getYouTubeURLs(){
    this.youTubeSongURL = "https://www.youtube.com/embed/" + this.birthDaySong.youtubeId;
    this.youTubeMovieURL = "https://www.youtube.com/embed/" + this.birthDayMovie.youtubeId;
    return;
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
      const startDate = new Date(obj.startDate);
      const endDate = new Date(obj.endDate);
  
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

  private getYoutubeThumbnailUrl(youtubeId: string): string {
    if (!youtubeId) return '';
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  }

  private getYearlySongs(birthDate: Date): void {
    this.yearlySongs = [];
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();
    const birthYear = birthDate.getFullYear();
    const currentYear = new Date().getFullYear();
    
    // Loop through each year from birth year to current year
    for (let year = birthYear; year <= currentYear; year++) {
      // Create a date for this year with same month/day as birthday
      const dateToCheck = new Date(year, birthMonth, birthDay);
      
      // Find a song that was #1 on this date
      for (const song of this.songs) {
        const startDate = new Date(song.startDate);
        const endDate = new Date(song.endDate);
        
        // Check if the date falls within this song's range
        if (dateToCheck >= startDate && dateToCheck <= endDate) {
          // Create a copy of the song with the specific year and thumbnail
          const songForYear = {
            ...song, 
            yearForDisplay: year,
            youtubeThumb: this.getYoutubeThumbnailUrl(song.youtubeId)
          };
          this.yearlySongs.push(songForYear);
          break; // Found a song for this year, move to next year
        }
      }
    }
    
    // Only show the section if we found songs
    this.showYearlySongs = this.yearlySongs.length > 0;
  }

  private addStructuredData(): void {
    // Remove any existing structured data
    const existingScript = document.querySelector('#birthdayStructuredData');
    if (existingScript) {
      existingScript.remove();
    }
  
    // Create structured data for the page
    const script = document.createElement('script');
    script.id = 'birthdayStructuredData';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Find the #1 Song on Your Birthday | Famous People Born This Day',
      'description': 'Discover the number one song on your birthday, famous people born on this day, and more.',
      'mainEntity': {
        '@type': 'WebApplication',
        'name': 'Birthday Song Finder',
        'applicationCategory': 'EntertainmentApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      }
    });
  
    // Add the structured data to the document head
    document.head.appendChild(script);
  }

  private addStructuredDataWithSong(song: ISong, dateStr: string): void {
    // Remove any existing structured data
    const existingScript = document.querySelector('#birthdayStructuredData');
    if (existingScript) {
      existingScript.remove();
    }

    // Create structured data with specific song information
    const script = document.createElement('script');
    script.id = 'birthdayStructuredData';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': `#1 Song on ${dateStr} was ${song.songTitle} by ${song.artist}`,
      'description': `Discover the number one song on ${dateStr} and famous people born on this day.`,
      'mainEntity': {
        '@type': 'MusicRecording',
        'name': song.songTitle,
        'byArtist': {
          '@type': 'MusicGroup',
          'name': song.artist
        }
      }
    });

    // Add the structured data to the document head
    document.head.appendChild(script);
  }

  public goToPresidentPage(){
    let sluggedPresident = slugify(this.currentPresident.name);
    this.router.navigate(['/president/' + sluggedPresident])
  }

  public toggleYearlySongsAccordion(): void {
    this.isYearlySongsExpanded = !this.isYearlySongsExpanded;
  }

  // Add this property to track which FAQ items are expanded
  public expandedFaqItems: boolean[] = [false, false, false];

  // Add this method to toggle FAQ items
  public toggleFaqItem(index: number): void {
    this.expandedFaqItems[index] = !this.expandedFaqItems[index];
  }
}
