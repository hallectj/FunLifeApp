import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { GENERAL_URL, IBiographicalInfo, ICelebrity, IDateObj, IHistEvent, IMovie, IPresident, ISong, ISport, IToy } from '../models/shared-models';
import { findMatchingName } from '../common/Toolbox/util';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private sparqlEndpoint = 'https://query.wikidata.org/sparql';
  public coreWikiURL = 'https://en.wikipedia.org/w/api.php';
  public wikidataApiUrl = 'https://www.wikidata.org/w/api.php';
  private celebritySubject: Subject<any> = new Subject<any>();
  private birthdateSession: Date = new Date();
  public hasBirthdayBtnClickedBefore: boolean = false;

  public server_url = "http://localhost:5000";

  constructor(private http: HttpClient) {}

  public setBirthDate(birthDate: Date){
    this.birthdateSession = birthDate;
  }
  
  public getBirthDate(){
    return this.birthdateSession;
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
    return diffDays + 1; // Include both start and end dates in the count
  }

  private getYoutubeThumbnailUrl(youtubeId: string): string {
    if (!youtubeId) return '';

    const videoId = youtubeId.match('[\\?&]v=([^&#]*)');
    const video = videoId ? videoId[1] : youtubeId;
    return `http://img.youtube.com/vi/${video}/2.jpg`;
  }

  public getPresidents(): Observable<IPresident[]>{
    return this.http.get<any>(this.server_url + '/presidents').pipe(
      map((response) => {
        const presidents: IPresident[] = response.map((president: IPresident) => {
          const startDate = new Date(president.startDate).toISOString().split("T")[0];
          let endDate: string = "";
          if(president.endDate === "present"){
            endDate = new Date().toISOString().split("T")[0];
          }else{
            endDate = new Date(president.endDate).toISOString().split("T")[0];
          }
          const birthDate = new Date(president.birthdate).toISOString().split("T")[0];
          return { ...president, startDate, endDate, birthDate };
        });
        return presidents as IPresident[];
      })
    )
  }

  private getData<T>(endpoint: string, year?: string): Observable<T> {
    const filePath = `${GENERAL_URL}/${endpoint}`;
    return this.http.get<any>(filePath).pipe(
      map((response) => {
        if (response && response.dataset === 'songs' && response.songs) {
          const songs: ISong[] = response.songs.map((song: any) => {
            const startDate = new Date(song.startDate);
            const endDate = new Date(song.endDate);
            const days = this.calculateDays(startDate, endDate);
            const youtubeThumb = this.getYoutubeThumbnailUrl(song.youtubeId);
            return { ...song, days, youtubeThumb };
          });
          return songs as T;
        }else if(response && response.dataset === "sports"){
          const yearData = response?.year?.[year];
          if (yearData) {
            const sportsArray: ISport[] = [];
            Object.keys(yearData.sport).forEach((sportType: string) => {
              const sportData = yearData.sport[sportType];
              sportsArray.push({
                sport: sportType,
                ...sportData
              });
            });
            return sportsArray as T;
          } else {
            return null;
          }
        }else if(response && response.dataset === "presidents"){
          const presidents: IPresident[] = response.presidents.map((president: IPresident) => {
            const startDate = new Date(president.startDate).toISOString().split("T")[0];
            let endDate: string = "";
            if(president.endDate === "present"){
              endDate = new Date().toISOString().split("T")[0];
            }else{
              endDate = new Date(president.endDate).toISOString().split("T")[0];
            }
            const birthDate = new Date(president.birthdate).toISOString().split("T")[0];
            return { ...president, startDate, endDate, birthDate };
          });
          return presidents as T;
        }else if(response && response.dataset === "movies"){
          const movies: IMovie[] = response.movies.map((movie: IMovie) => {
            const startDate = new Date(movie.startDate);
            const endDate = new Date(movie.endDate);
            return { ... movie, startDate, endDate} ;
          });
          return movies as T;
        }else if(response && response.dataset === "historical_toys"){
          const toys: IToy[] = response.toys.map((toy: IToy) => {
            return { ...toy };
          });
          return toys as T;
        }
        return response as T;
      })
    );
  }

  public getSongs(): Observable<ISong[]> {
    return this.getData<ISong[]>('topSongs.json');
  }

  public getSportsByYear(year: string): Observable<ISport[]>{
    return this.getData<ISport[]>('sports.json', year);
  }
  
  public getMovies(): Observable<IMovie[]>{
    return this.getData<IMovie[]>("topMovies.json");
  }

  public getToys(): Observable<IToy[]>{
    return this.getData<IToy[]>("topToys.json");
  }

  private celebDataBirthsFunc(endpoint: string, date: Date, isAllThreeDates: boolean): Observable<{ [date: string]: ICelebrity[] } | ICelebrity[]> {
    const filePath = `${GENERAL_URL}/${endpoint}`;
  
    // Calculate yesterday, today, and tomorrow dates
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
  
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
  
    const formattedDates = [
      this.formatDate(yesterday),
      this.formatDate(date),
      this.formatDate(tomorrow)
    ];
  
    // Make an HTTP GET request to fetch the JSON data
    return this.http.get<{ [date: string]: ICelebrity[] }>(filePath).pipe(
      map((response) => {
        // Filter and construct the response based on the calculated dates
        const result: { [date: string]: ICelebrity[] } = {};
  
        formattedDates.forEach((formattedDate) => {
          if (response[formattedDate]) {
            result[formattedDate] = response[formattedDate];
          }
        });

        if (isAllThreeDates) {
          return result;
        } else {
          return result[formattedDates[1]] || [];
        }
      })
    );
  }

  public getCelebrityBirths(date: Date, isAllThreeDates: boolean = false){
    return this.celebDataBirthsFunc("celebrityBirthdays.json", date, isAllThreeDates);
  }

  public getTruePresidentName(name: string): Observable<string[]>{
    return this.getPresidents().pipe(
      map((presidents: IPresident[]) => {
        const strArr: string[] = [];
        const value = findMatchingName(name, presidents.map(v => v.name));
        if(!!value){
          strArr.push(value);
        }
        return strArr;
      })
    )
  }

  public getTrueCelebName(name: string): Observable<string[]>{
    const endpoint = "celebrityBirthdays.json";
    const filePath = `${GENERAL_URL}/${endpoint}`;

    return this.http.get(filePath).pipe(
      map(response => {
        // Assuming the response structure is the same as your JSON example
        const data = response;
        //will ever only be one element or no elements
        const strArr: string[] = [];

        for (const key in data) {
          if (key !== "dataset") {
            const arr: ICelebrity[] = data[key];
            const value = findMatchingName(name, arr.map(v => v.name));
            if(!!value){
              strArr.push(value);
              break;
            }
          }
        }

        return strArr;
      })
    )
  }

  public checkIfCelebrityExist(name: string): Observable<boolean>{
    const endpoint = "celebrityBirthdays.json";
    const filePath = `${GENERAL_URL}/${endpoint}`;

    const d = this.http.get(filePath).pipe(
      map(response => {
        // Assuming the response structure is the same as your JSON example
        const data = response;
        //will ever only be one element or no elements
        const strArr: string[] = [];

        for (const key in data) {
          if (key !== "dataset") {
            const arr: ICelebrity[] = data[key];
            const value = findMatchingName(name, arr.map(v => v.name));
            if(!!value){
              return true;
            }
          }
        }

        return false;
      })
      
    )
    return d;
  }

  public async getCorrectedWikiTitle(qid: string): Promise<string>  {
    const wikidataParams = {
      action: 'wbgetentities',
      format: 'json',
      origin: '*',
      props: 'sitelinks',
      ids: qid,
      sitefilter: 'wiki',
    };
  
    // Query Wikidata to get the site links
    const wikidataResponse = await this.http
      .get<any>(this.wikidataApiUrl, { params: wikidataParams })
      .toPromise();
  
    // Extract the Wikipedia title for the rapper
    const correctTitle = wikidataResponse?.entities[qid]?.sitelinks?.enwiki?.title;
    return (!!correctTitle) ? correctTitle : "";
  }

  public callWikiAPITopic(value: string){
    const params = new HttpParams()
      .set('action', 'query')
      .set('format', 'json')
      .set('prop', 'extracts|pageimages|info')
      .set('piprop', 'original|name')
      .set('exintro', '')
      .set('inprop', 'url')
      .set('explaintext', '')
      .set('origin', '*')
      .set('titles', value)
      .set('redirects', '1'); // Enable redirects

    return this.http.get<any>(this.coreWikiURL, {params})
  }

  public callWikiAPIMultipleTopics(values: string[]){
    const params = new HttpParams()
      .set('action', 'query')
      .set('format', 'json')
      .set('prop', 'extracts|pageimages|info')
      .set('piprop', 'original|name')
      .set('exintro', '')
      .set('inprop', 'url')
      .set('explaintext', '')
      .set('origin', '*')
      .set('titles', values.join("|"))
      .set('redirects', '1'); // Enable redirects

    return this.http.get<any>(this.coreWikiURL, {params})
  }

  public callWikiAPI(date: Date, dataCategory: string): Observable<any>{
    if(date && date instanceof Date){
      let d = date.getDate();
      
      const cats: string[] = ["births", "deaths", "events", "holidays", "selected"];
      const idx = cats.findIndex(v => v === dataCategory);
      if(idx === -1){
        throw new Error("Category does not exist on API");
      }

      const wikiURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/${dataCategory}/${date.getMonth() + 1}/${d}`;
      return this.http.get<any>(wikiURL);
    }
    
    return null;
  }

  public getRandomQuote(): Observable<any> {
    // First, call the Quote Garden API to get a random quote
    return this.http.get('https://quote-garden.onrender.com/api/v3/quotes/random').pipe(
      switchMap((quoteResponse: any) => {
        // Extract the author's name from the quote response
        const authorName = (quoteResponse.data[0].quoteAuthor);

        const params = {
          action: 'query',
          format: 'json',
          prop: 'pageimages',
          piprop: 'original',
          origin: '*',
          titles: authorName
        }
  
        // Now, call the Wikipedia API to get the author's image
        return this.http.get(this.coreWikiURL, {params}).pipe(
          map((wikiResponse: any) => {
            // Extract the author's image URL from the Wikipedia response
            const pages = wikiResponse?.query?.pages;
            let pageId = -1;
            let authorImage = "";
            if(pages){
              pageId = +Object.keys(pages)[0];
              authorImage = pages[pageId]?.original?.source;
            }
            
            // Add the author's image URL to the quote response
            quoteResponse.data[0].authorImage = authorImage;
  
            // Return the modified quote response
            return quoteResponse;
          })
        );
      })
    );
  }

  public getEvents(date: Date): Observable<IHistEvent[]>{
    return this.callWikiAPI(date, 'events').pipe(
      map((response) => {
        const events: IHistEvent[] = response.events.map((v: any) => {
          let image = (v.pages[0]?.originalimage?.source) ? v.pages[0]?.originalimage?.source : "";
          let wikiURL = (v.pages[0]?.content_urls?.desktop?.page) ? v.pages[0]?.content_urls?.desktop?.page : "";
          let title = (v.pages[0]?.normalizedtitle) ? v.pages[0]?.normalizedtitle : "";
          const obj: IHistEvent = {
            description: v.text,
            year: v.year,
            imageURL: image,
            wikiURL: wikiURL,
            title: title,
            noImageFound: (image === "") ? true : false
          }
          return obj;
        })
        return events;
      })
    )
  }

  public getBiographicalInformation(person_name: string){
    let sparqlQuery = `
    SELECT ?person ?personLabel ?countryLabel ?birthdate (GROUP_CONCAT(DISTINCT ?occupationLabel_en; separator=", ") as ?occupations) ?birthPlaceLabel 
    ?image (GROUP_CONCAT(DISTINCT ?spouseLabel_en; separator=", ") as ?spouses) 
    ?familyLabel ?familyDescription ?followers ?qid
    WHERE {
      ?person wdt:P31 wd:Q5. # Select instances of humans
      ?person rdfs:label "${person_name}"@en.
    
      OPTIONAL { 
         ?person p:P569 ?statement .
         ?statement a wikibase:BestRank ;
             ps:P569 ?birthdate ;
             psv:P569/wikibase:timePrecision ?precision .
         FILTER (?precision >= 11)
      }
      
      OPTIONAL { ?person wdt:P106 ?occupation. 
        OPTIONAL {
          ?occupation rdfs:label ?occupationLabel_en.
          FILTER(LANG(?occupationLabel_en) = "en")
        }
      }
    
      OPTIONAL { ?person wdt:P19 ?birthPlace. }  # Retrieve place of birth  
      OPTIONAL { ?person wdt:P27 ?country . }    # Citizenship
      OPTIONAL { ?person wdt:P18 ?image. }       # Retrieve image
      OPTIONAL { ?person wdt:P8687 ?followers. } # Social Media Followers
    
      OPTIONAL {
        ?person wdt:P26 ?spouse.
        ?spouse rdfs:label ?spouseLabel_en.
        FILTER(LANG(?spouseLabel_en) = "en")
      }
      
      OPTIONAL { ?person wdt:P22 ?family. } # Retrieve family info 
      BIND(STR(?person) AS ?qid)
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    GROUP BY ?person ?personLabel ?countryLabel ?followers ?birthdate ?birthPlaceLabel ?image ?familyLabel ?familyDescription ?qid
    ORDER BY DESC(?followers)
    LIMIT 1
    `

    const headers = {
      'Accept': 'application/sparql-results+json'
    };

    const params = new HttpParams().set('query', sparqlQuery);

    return this.http.get<any>(this.sparqlEndpoint, {
      params: params,
      headers: headers
    }).pipe(map(this.mapResponseToBiographicalInfo));
  }
  
  
  
  
  public findLongestNumberOneSongs(songs: ISong[], year: number, count: number): ISong[] {
    const filteredSongs = songs.filter((song) => {
      const startDateYear = new Date(song.startDate).getFullYear();
      return startDateYear === year;
    });

    filteredSongs.sort((a, b) => (b.days || 0) - (a.days || 0));

    return filteredSongs.slice(0, count);
  }

  public populateDateObj(d?: Date): IDateObj {
    let date: Date = null;
    if(d){
      date = new Date(d);
    }else{
      date = new Date();
    }

    date.setHours(0, 0, 0, 0);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[date.getMonth()];
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();
    if(month.length === 1) month = "0" + month;
    if(day.length === 1) day = "0" + day;
    const year = date.getFullYear().toString();

    return {date, day, month, monthName, year}
  }

  public sendCelebInfo(celebObj: any){
    this.celebritySubject.next(celebObj);
  }

  public subscribeToCelebInfo(){
    return this.celebritySubject.asObservable();
  }

  private mapResponseToBiographicalInfo(response: any): IBiographicalInfo{
    const binding = response.results.bindings[0];

    const qidURL = binding?.qid?.value;
    let qid = "";
    if(!!qidURL){
      qid = qidURL.substring(qidURL.lastIndexOf("/")+1, qidURL.length).trim();
    }

    const bioObj: IBiographicalInfo = {
      name: (binding?.personLabel?.value),
      spouses: binding?.spouses?.value.split(','),
      occupations: binding?.occupations?.value.split(','),
      family: binding?.familyLabel?.value,
      familyDesc: binding?.familyDescription?.value,
      citizenship: binding?.countryLabel?.value,
      birthPlace: binding?.birthPlaceLabel?.value,
      image: binding?.image?.value,
      birthDate: binding?.birthdate?.value,
      followers: binding?.followers?.value,
      qid: qid
    }
    
    return bioObj;
  }

  private mapResponseToIFamousBirths(response: any): ICelebrity[] {
    const bindings = response.results.bindings;
    const famousBirths: ICelebrity[] = [];
  
    for (const binding of bindings) {
      const wikiURL = binding.person.value;
      const name = binding.personLabel.value;
      const birthdate = new Date(binding.birthdate.value).toISOString();
      const followerCount = parseInt(binding.followers.value);
      const image = binding.uniqueImage.value;
      //const country = binding.countryLabel.value;
      const occupations = binding.occupations.value.split(',');
  
      famousBirths.push({
        name,
        birthdate,
        followerCount,
        image,
        occupations
      });
    }
  
    return famousBirths;
  }

  public containsBadWord(inputString: string) {
    const badWords = ['oral sex', 'sex', 'lesbianism', 'anal sex', 'vaginal intercourse', 'pornographic actor', 'pornographic actress'];
    return badWords.some(v => v === inputString.trimStart().toLowerCase());
  }

  public getMonthAndDayFromISOString(isoString: string) {
    const date = new Date(isoString); // Create a Date object from the ISO string
    const month = date.getUTCMonth() + 1; // Get the month (0-indexed, so add 1)
    const day = date.getUTCDate(); // Get the day
  
    return { month, day };
  }

  // Define a function to format a date as "MM-DD"
  public formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  }
}
