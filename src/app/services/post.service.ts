import { Injectable } from '@angular/core';
import { Observable, Subject, delay, of } from 'rxjs';
import { IPostExcerpt } from '../models/shared-models';
import { DUMMYPOST_1, DUMMYPOST_2 } from '../common/Toolbox/dummyPosts';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  constructor() { }

  private postSubject: Subject<IPostExcerpt> = new Subject<IPostExcerpt>();

  public notifyPostBlogComponentOfPost(post: IPostExcerpt){
    this.postSubject.next(post);
  }

  public subscribeToPostExcerpt(): Observable<IPostExcerpt>{
    return this.postSubject.asObservable();
  }
  
  public getDummyPosts(): Observable<IPostExcerpt[]> {
    // Simulate fetching dummyPosts with a delay of 2 seconds;
    return of(dummyPosts).pipe(delay(2000));
  }

  public getPostExcerpt(title: string){
    return dummyPosts.find(v => v.excerptTitle.toLowerCase() === title.toLowerCase());
  }

  public getPost(useOtherArticle: boolean){
    //Simulating post retrieval, will update when backend code is introduced.
    if(useOtherArticle){
      return of(DUMMYPOST_2).pipe(delay(4000));
    }else{
      return of(DUMMYPOST_1).pipe(delay(4000));
    }
  }
}

//dummy post for now until backend is complete
const dummyPosts: IPostExcerpt[] = [
  {
    excerptImage: "https://rwrant.co.za/wp-content/uploads/2018/07/The-1980s.jpg",
    excerptTitle: "Why the 1980s was a Totally Rad Decade",
    excerptDesc: "The 1980s was such an unusual decade, with fashion, the trends, that no other decade could ever come close. Did you know that in ...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://i.pinimg.com/originals/3d/fd/ed/3dfded39445e1e437de0bcf342cebbcc.jpg",
    excerptTitle: "Celebrities that Attended High School Together",
    excerptDesc: "You've seen Adam Levine and Jonah Hill in movies together, but did you know they went to the same highschool? Not just them, Matt Damon and ...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Hibbing_High_School_2014.jpg/1200px-Hibbing_High_School_2014.jpg",
    excerptTitle: "Highschool throughout the decades",
    excerptDesc: "How much has highschool changed throughout the years? In this article we will explore highschool from the 1950s up to the 2020s...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=4",
    excerptTitle: "Post 4 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=5",
    excerptTitle: "Post 5 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=6",
    excerptTitle: "Post 6 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=7",
    excerptTitle: "Post 7 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=8",
    excerptTitle: "Post 8 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=9",
    excerptTitle: "Post 9 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=10",
    excerptTitle: "Post 10 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=11",
    excerptTitle: "Post 11 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=12",
    excerptTitle: "Post 12 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=13",
    excerptTitle: "Post 13 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=14",
    excerptTitle: "Post 14 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=15",
    excerptTitle: "Post 15 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=16",
    excerptTitle: "Post 16 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=17",
    excerptTitle: "Post 17 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=18",
    excerptTitle: "Post 18 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=19",
    excerptTitle: "Post 19 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=20",
    excerptTitle: "Post 20 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=21",
    excerptTitle: "Post 21 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=22",
    excerptTitle: "Post 22 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=23",
    excerptTitle: "Post 23 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=24",
    excerptTitle: "Post 24 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=25",
    excerptTitle: "Post 25 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=26",
    excerptTitle: "Post 26 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=27",
    excerptTitle: "Post 27 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=28",
    excerptTitle: "Post 28 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=29",
    excerptTitle: "Post 29 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=30",
    excerptTitle: "Post 30 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    excerptImage: "https://source.unsplash.com/random/200x200?sig=31",
    excerptTitle: "Post 31 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  }
];