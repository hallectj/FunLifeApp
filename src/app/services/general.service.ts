import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GENERAL_URL, ISong, ISport } from '../models/shared-models';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
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

  public findLongestNumberOneSongs(songs: ISong[], year: number, count: number): ISong[] {
    const filteredSongs = songs.filter((song) => {
      const startDateYear = new Date(song.startDate).getFullYear();
      return startDateYear === year;
    });

    filteredSongs.sort((a, b) => (b.days || 0) - (a.days || 0));

    return filteredSongs.slice(0, count);
  }
}
