export const GENERAL_URL = "https://hallectj.github.io"

type DataResponse<T> = {
  //dataset: string;
  [key: string]: T[];
};

export interface IDateObj  {
  today: Date, 
  day: string, 
  month: string, 
  monthName: string, 
  year: string
} 

export interface Inflation {
  currency: string, 
  year: string, 
  gas: string, 
  bread: string, 
  movie_ticket: string, 
  car: string
}

export interface IPresident{
  number: string,
  name: string,
  startDate: Date,
  endDate: Date,
  portraitURL: string,
  portraitDesc: string,
  portraitSource: string
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

export interface IMovie{
  ticketPrice: number,
  movieTitle: string,
  startDate: Date,
  endDate: Date,
  youtubeId: string
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

export interface ICelebCard{
  size: string,
  medalColor: string,
  image: string,
  showSkills: boolean,
  celebPopularity: number,
  celebInfo: {name: string, age: number, occupations: string[]}
};

export interface ICelebrity{
  name: string,
  birthdate: Date,
  followerCount: number,
  image: string,
  occupations: string[]
}