import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, Subject, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { GENERAL_URL, IBiographicalInfo, ICelebrity, IDateObj, IHistEvent, IMovie, IPresident, ISong, ISong2, ISongInfoObj, ISport, IToy } from '../models/shared-models';
import { findMatchingName, slugify } from '../common/Toolbox/util';
import Fuse from 'fuse.js';
import { ErrorHandlerService } from '../services/error-handler.service'
import { environment } from 'src/environments/environment';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

// Define a Fuse configuration for fuzzy matching
const fuseOptions = {
  keys: ['song', 'artist'], // Define the keys to search for
  includeScore: true,
  threshold: 0.7, // Adjust the threshold as needed
};

const SONGS_KEY = (year: number) => makeStateKey<ISong2[]>(`songs-${year}`);

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private sparqlEndpoint = 'https://query.wikidata.org/sparql';
  public coreWikiURL = 'https://en.wikipedia.org/w/api.php';
  public wikidataApiUrl = 'https://www.wikidata.org/w/api.php';
  private corsAnywhere = "https://cors-anywhere.herokuapp.com"
  private birthdateSession: Date = new Date();
  public hasBirthdayBtnClickedBefore: boolean = false;

  private sidebarSubject: Subject<number> = new Subject<number>();
  private yearSubject: Subject<number> = new Subject<number>();
  private mainSongPageTitleSubject: Subject<string> = new Subject<string>();

  public server_url = environment.apiUrl;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId: Object) {}

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

  public getYoutubeThumbnailUrl(youtubeId: string): string {
    if (!youtubeId) return '';

    const videoId = youtubeId.match('[\\?&]v=([^&#]*)');
    const video = videoId ? videoId[1] : youtubeId;
    return `https://img.youtube.com/vi/${video}/2.jpg`;
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
        if(response && response.dataset === "sports"){
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

  public sendYearToChild(year: number){
    this.yearSubject.next(year);
  }

  public subscribeToYearChange(){
    return this.yearSubject.asObservable();
  }

  public refreshSidebarSongs(year: number){
    this.sidebarSubject.next(year);
  }

  public subscribeToSidebarRefresh(){
    return this.sidebarSubject.asObservable();
  }

  public updateMainSongPageTitle(title: string){
    this.mainSongPageTitleSubject.next(title);
  }

  public subscribeToMainSongPageTitle(){
    return this.mainSongPageTitleSubject.asObservable();
  }


  public getSongs(year: number, orderByPosition: string = "position", spliceAmount: number = 0): Observable<ISong2[]> {
    const songsKey = SONGS_KEY(year);

    if (isPlatformServer(this.platformId)) {
      // Server: Try real fetch, fall back to mock
      const headers = new HttpHeaders().set('X-Order-By', orderByPosition);
      const url = `${this.server_url}/top-songs/${year}`;
      console.log(`[${year}] Server fetching: ${url}`);

      return this.http.get<ISong2[]>(url, { headers }).pipe(
        map((response: ISong2[]) => {
          const songObjects = response.map((songObj: ISong2) => {
            songObj.youtubeThumb = this.getYoutubeThumbnailUrl(songObj.videoId);
            return { ...songObj };
          });
          return spliceAmount > 0 ? songObjects.slice(0, spliceAmount) : songObjects;
        }),
        tap(songs => {
          console.log(`[${year}] Server storing ${songs.length} real songs`);
          this.transferState.set(songsKey, songs);
        }),
        catchError(err => {
          console.error(`[${year}] Server fetch error:`, err.message);
          const mockSongs: ISong2[] = [
            { position: 1, artist : "Mock Artist", song: "Mock Song", year: year, youtubeThumb: "https://img.youtube.com/vi/mock1/default.jpg", videoId: "mock1" },
            { position: 2, artist : "Another Mock", song: "Another Song", year: year, youtubeThumb: "https://img.youtube.com/vi/mock2/default.jpg", videoId: "mock2" }
          ];
          console.log(`[${year}] Server using mock data`);
          this.transferState.set(songsKey, mockSongs);
          return of(mockSongs);
        })
      );
    } else {
      // Client: Always fetch real data, ignore TransferState unless confirmed real
      const headers = new HttpHeaders().set('X-Order-By', orderByPosition);
      const url = `${this.server_url}/top-songs/${year}`;
      console.log(`[${year}] Client fetching: ${url}`);

      return this.http.get<ISong2[]>(url, { headers }).pipe(
        map((response: ISong2[]) => {
          const songObjects = response.map((songObj: ISong2) => {
            songObj.youtubeThumb = this.getYoutubeThumbnailUrl(songObj.videoId);
            return { ...songObj };
          });
          console.log(`[${year}] Client fetched ${songObjects.length} songs`);
          return spliceAmount > 0 ? songObjects.slice(0, spliceAmount) : songObjects;
        }),
        catchError(err => {
          console.error(`[${year}] Client fetch error:`, err.message);
          // Use TransferState as fallback if it exists (mock or real)
          if (this.transferState.hasKey(songsKey)) {
            const cachedSongs = this.transferState.get(songsKey, null as ISong2[]);
            console.log(`[${year}] Client using TransferState fallback: ${cachedSongs.length}`);
            return of(cachedSongs);
          }
          return of([]); // Empty if no fallback
        })
      );
    }
  }
  public getNumberOneHitSongs(): Observable<ISong[]>{
    const apiURL = this.server_url + "/" + "number-one-hits";
    return this.http.get<any>(apiURL);
  }

  public getSongFromPosition(year: number, position: number){
    const apiURL = this.server_url + "/top-songs/" + year + "/" + position;
    return this.http.get<any>(apiURL);
  }


  public fetchSongInfoObject(songobj: ISong2): Observable<ISongInfoObj | null> {
    const apiUrl = this.server_url + "/song-info/song/" + songobj.song + "/" + songobj.artist;
    return this.http.get<ISongInfoObj>(apiUrl).pipe(
      map(response => {
        if (response && response['error']) {
          return {
            artist: "",
            song: "",
            highest_peak_date: "",
            peak_position: -1,
            weeks_on_chart: -1
          }
        }
        return response;
      }),
      catchError((error) => {
        if (error && error['error']) {
          return of(
             {
              artist: "",
              song: "",
              highest_peak_date: "",
              peak_position: -1,
              weeks_on_chart: -1
            }
          )
        }
        return this.errorHandler.handleError(error);
      })
    );
  }

  public getSongWithInfo(year: number, position: number): Observable<{ songObj: ISong2, infoObj: ISongInfoObj | null }> {
    const emptyISong2: ISong2 = {
      position: -1,
      artist: "",
      song: "",
      year: 1990,
      youtubeThumb: "",
      videoId: ""
    };

    const emptyInfoObj: ISongInfoObj = {
      artist: "",
      song: "",
      highest_peak_date: "",
      peak_position: -1,
      weeks_on_chart: -1
    }
    return this.getSongObj(year, position).pipe(
      switchMap((songObj: ISong2) => {
        return this.fetchSongInfoObject(songObj).pipe(
          map((infoObj: ISongInfoObj) => ({ songObj, infoObj })),
          catchError((error) => {
            // Handle error if needed
            console.error('Error in fetchSongInfoObject:', error);
            // You can return a default value or throw the error again if needed
            return of({ songObj, infoObj: emptyInfoObj });
          })
        );
      }),
      catchError((error) => {
        // Handle error if needed
        console.error('Error in getSongObj:', error);
        // You can return a default value or throw the error again if needed
        return of({ songObj: emptyISong2, infoObj: emptyInfoObj });
      })
    );
  }

  private fetchSongObjects(songArtists: any[]): Observable<ISongInfoObj[]> {
    const apiUrl = this.server_url + "/song-info/songs"; // Replace with your actual API endpoint
    const requestBody = { pairs: songArtists };
    return this.http.post<any>(apiUrl, requestBody);
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

  public getCelebrityByDateSet(dateset: string):  Observable<ICelebrity[]>{
    const url = this.server_url + "/celebrities/" + dateset;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const celebs: ICelebrity[] = response.map((celeb: ICelebrity) => {
          const birthDate = new Date(celeb.birthdate).toISOString().split("T")[0];
          return { ...celeb, birthDate };
        });
        return celebs as ICelebrity[];
      })
    )
  }

  public getTopCelebrityByDateSet(dateset: string): Observable<ICelebrity> {
    const url = this.server_url + "/celebrities/" + dateset + "/top"
    return this.http.get<any>(url);
  }

  public getCelebrityByName(celebName: string): Observable<ICelebrity>{
    const url = this.server_url + "/celebrities/celeb/" + celebName;
    return this.http.get<any>(url);
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
    const url = this.server_url + "/celebrities"; 
    return this.http.get<any>(url).pipe(
      map(response => {
        const data = response;
        //will ever only be one element or no elements
        const value = findMatchingName(name, data);
        return [value];
      })
    )
  }

  public getSongsByArtist(artist: string, includeSorting: boolean): Observable<ISong2[]>{
    const url = this.server_url + "/artist/" + artist;
    return this.http.get<any>(url).pipe(
      map((response: ISong2[]) => {
        const songObjects: ISong2[] = response.map((songObj: ISong2) => {
          songObj.youtubeThumb = this.getYoutubeThumbnailUrl(songObj.videoId);
          return { ...songObj };
        });
        if(includeSorting){
          return songObjects.sort((a, b) => a.year - b.year);
        }else{
          return songObjects;
        }
      })
    )
  }

  public getTrueArtistName(artist: string): Observable<string[]>{
    const url = this.server_url + "/artist/" + artist;
    return this.http.get<any>(url).pipe(
      map((response: ISong2[]) => {
        const data = response;
        const value = findMatchingName(artist, data.map(v => v.artist));
        return [value];
      })
    )
  }

  public getSongObj(year: number, position: number): Observable<ISong2>{
    const url = this.server_url + "/top-songs/" + year + "/" + position;
    return this.http.get<any>(url);
  }

/**
 * 
  public getTrueArtistName(artist: string): Observable<string[]>{
    const url = this.server_url + "/artist/" + artist;
    return this.http.get<any>(url).pipe(
      map((response: ISong2[]) => {
        const data = response;
        const value = findMatchingName(artist, data.map(v => v.artist));
        return [value];
      })
    )
  }
 */

  public getTrueSongName(year: number, position: number, song: string, artist: string): Observable<{artist: string, song: string}[]>{
    return this.getSongObj(year, position).pipe(
      map((response: ISong2) => {
        const foundSong = findMatchingName(song, [response.song]);
        const foundArtist = findMatchingName(artist, [response.artist]);
        return [{ artist: foundArtist, song: foundSong }]
      })
    )
  }

  public getTrueSongInfo(year: number, song: string, artist: string): Observable<{artist: string, song: string}>{
    const url = this.server_url + "/top-songs/" + year.toString();
    return this.http.get<any>(url).pipe(
      map((response: ISong2[]) => {
        const foundSong = findMatchingName(song, response.map(v => v.song));
        const foundArtist = findMatchingName(artist, response.map(v => v.artist));
        return { artist: foundArtist, song: foundSong };
      })
    )
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

  public getRandomQuote2(): Observable<any>{
    const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://zenquotes.io/api/random');
    return this.http.get(url);
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

  private mapResponseToBiographicalInfo(response: any): IBiographicalInfo{
    if(response.results.bindings.length === 0){
      return null;
    }
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

    if(bioObj.image && bioObj.image.startsWith("http://")){
      bioObj.image = bioObj.image.replace("http://", "https://");
    }

    if(bioObj.qid && bioObj.qid.startsWith("http://")){
      bioObj.qid = bioObj.qid.replace("http://", "https://");
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
      const imageB64 = "";
      //const country = binding.countryLabel.value;
      const occupations = binding.occupations.value.split(',');
  
      famousBirths.push({
        name,
        birthdate,
        followerCount,
        image,
        imageB64,
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
