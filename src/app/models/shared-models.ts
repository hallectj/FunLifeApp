export const GENERAL_URL = "https://hallectj.github.io"

type DataResponse<T> = {
  //dataset: string;
  [key: string]: T[];
};

export interface IPostExcerpt {
  postID: number,
  excerptImage: string,
  excerptTitle: string,
  excerptDesc: string,
  isFeaturePost: boolean
}

export interface IDateObj  {
  date: Date, 
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
  startDate: string,
  endDate: string,
  portraitURL: string,
  portraitDesc: string,
  portraitSource: string,
  party: string,
  birthCity: string,
  birthStateAbbr: string,
  birthdate: string,
  spouses: string[]
}

export interface IPost{
  userId: number,
  id: number,
  title: string,
  body: string
}

export interface IHistEvent{
  description: string,
  year: number, 
  imageURL: string,
  wikiURL: string,
  title: string,
  noImageFound: boolean
}

export interface IFamousQuote{
  __v: number,
  _id: string,
  authorImage: string,
  quoteAuthor: string,
  quoteGenre: string,
  quoteText: string
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

export interface IBiographicalInfo {
  spouses: string[],
  occupations: string[],
  family: string,
  familyDesc: string,
  citizenship: string,
  birthPlace: string,
  image: string,
  name: string,
  birthDate: Date,
  followers: string,
  qid: string
}

export interface ISport {
  sport: string,
  winner: string,
  loser: string,
  score: string,
  title: string,
  series: string
}

export interface IToy {
  year: number,
  toy: string,
  price: number,
  description: string,
  image: string,
  image_source: string,
  image_source_url: string
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
  birthdate: string,
  followerCount: number,
  image: string,
  occupations: string[]
}