export const GENERAL_URL = "https://hallectj.github.io"

type DataResponse<T> = {
  //dataset: string;
  [key: string]: T[];
};

export interface Inflation {
  currency: string, 
  year: string, 
  gas: string, 
  bread: string, 
  movie_ticket: string, 
  car: string
}

export interface ISong{
  artist: string,
  songTitle: string,
  startDate: Date,
  endDate: Date,
  youtubeId: string,
  days?: number,
  youtubeThumb?: string
}

export interface ISport {
  sport: string,
  winner: string,
  loser: string,
  score: string,
  title: string,
  series: string
}

export interface ISongWeeks {
  songs: ISong[],
  days: number[]
}