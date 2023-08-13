import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GENERAL_URL, IMovie, IPresident, ISong, ISport } from '../models/shared-models';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private sparqlEndpoint = 'https://query.wikidata.org/sparql';

  constructor(private http: HttpClient) {}

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
            const startDate = new Date(president.startDate);
            const endDate = new Date(president.endDate);
            return { ...president, startDate, endDate };
          });
          return presidents as T;
        }else if(response && response.dataset === "movies"){
          const movies: IMovie[] = response.movies.map((movie: IMovie) => {
            const startDate = new Date(movie.startDate);
            const endDate = new Date(movie.endDate);
            return { ... movie, startDate, endDate} ;
          });
          return movies as T;
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
  
  public getPresidents(): Observable<IPresident[]>{
    return this.getData<IPresident[]>('presidents.json')
  }

  public getMovies(): Observable<IMovie[]>{
    return this.getData<IMovie[]>("topMovies.json");
  }

  public callWikiAPI(date: Date, dataCategory: string): Observable<any>{
    if(date && date instanceof Date){
      let month = date.getMonth(); + 1;
      let d = date.getDate();
      console.log("month", month, "d", d);
      
      const cats: string[] = ["births", "deaths", "events", "holidays", "selected"];
      const idx = cats.findIndex(v => v === dataCategory);
      if(idx === -1){
        throw new Error("Category does not exist on API");
      }

      const wikiURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/${dataCategory}/${month}/${d}`;
      return this.http.get<any>(wikiURL);
    }
    
    return null;
  }

  public getFamousPeopleByDate(month: string, day: string): Observable<any> {
    const sparqlQuery = `
      PREFIX wd: <http://www.wikidata.org/entity/>
      PREFIX wdt: <http://www.wikidata.org/prop/direct/>
      PREFIX wikibase: <http://wikiba.se/ontology#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?person ?personLabel ?birthdate ?followers ?uniqueImage ?countryLabel
      WHERE {
        VALUES ?country {wd:Q30 wd:Q145}
        ?person wdt:P31 wd:Q5 ;  # Instance of human
          wdt:P569 ?birthdate ;  # Date of birth
          wdt:P27 ?country ;  # Citizenship
          wdt:P8687 ?followers; # Social Media Followers 
          wdt:P18 ?uniqueImage .  # Image

        FILTER(CONTAINS(STR(?birthdate), "${month}-${day}"))

        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      GROUP BY ?person ?personLabel ?birthdate ?followers ?uniqueImage ?countryLabel
      ORDER BY DESC(?followers)
      LIMIT 20`;

    const headers = {
      'Accept': 'application/sparql-results+json'
    };

    const params = new HttpParams().set('query', sparqlQuery);

    return this.http.get<any>(this.sparqlEndpoint, {
      params: params,
      headers: headers
    });
  }
  
  
  
  
  public findLongestNumberOneSongs(songs: ISong[], year: number, count: number): ISong[] {
    const filteredSongs = songs.filter((song) => {
      const startDateYear = new Date(song.startDate).getFullYear();
      return startDateYear === year;
    });

    filteredSongs.sort((a, b) => (b.days || 0) - (a.days || 0));

    return filteredSongs.slice(0, count);
  }
}
