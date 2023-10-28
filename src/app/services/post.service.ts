import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, delay, find, map, of, throwError } from 'rxjs';
import { IPost, IPostExcerpt } from '../models/shared-models';
import { DUMMYPOST_1, DUMMYPOST_2 } from '../common/Toolbox/dummyPosts';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private dummy_post_api_url = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }

  
  public getDummyPostsExcerpts(): Observable<IPostExcerpt[]> {
    // Simulate fetching dummyPosts with a delay of 2 seconds;
    return of(dummyPosts).pipe(delay(2000));
  }

  public getPostExcerpt(title: string): IPostExcerpt {
    const idx = dummyPosts.findIndex(v => v.excerptTitle.toLowerCase() === title.toLowerCase());
    if(idx !== -1){
      return dummyPosts[idx];
    }else{
      return {
        postID: -1,
        excerptImage: "",
        excerptTitle: "",
        excerptDesc: "",
        isFeaturePost: false
      }
    }
  }

  public getPost(postID: number): Observable<IPost>{
    const url = `${this.dummy_post_api_url}/${postID}`;
    return this.http.get<IPost>(url).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(null);
        }
        return throwError(error);
      })
    );
  }
}

//dummy post for now until backend is complete
const dummyPosts: IPostExcerpt[] = [
  {
    postID: 1,
    excerptImage: "https://rwrant.co.za/wp-content/uploads/2018/07/The-1980s.jpg",
    excerptTitle: "Why the 1980s was a Totally Rad Decade",
    excerptDesc: "The 1980s was such an unusual decade, with fashion, the trends, that no other decade could ever come close. Did you know that in ...",
    isFeaturePost: false
  },
  {
    postID: 2,
    excerptImage: "https://i.pinimg.com/originals/3d/fd/ed/3dfded39445e1e437de0bcf342cebbcc.jpg",
    excerptTitle: "Celebrities that Attended High School Together",
    excerptDesc: "You've seen Adam Levine and Jonah Hill in movies together, but did you know they went to the same highschool? Not just them, Matt Damon and ...",
    isFeaturePost: false
  },
  {
    postID: 3,
    excerptImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Hibbing_High_School_2014.jpg/1200px-Hibbing_High_School_2014.jpg",
    excerptTitle: "Highschool throughout the decades",
    excerptDesc: "How much has highschool changed throughout the years? In this article we will explore highschool from the 1950s up to the 2020s...",
    isFeaturePost: false
  },
  {
    postID: 4,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=4",
    excerptTitle: "Post 4 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 5,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=5",
    excerptTitle: "Post 5 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 6,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=6",
    excerptTitle: "Post 6 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 7,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=7",
    excerptTitle: "Post 7 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 8,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=8",
    excerptTitle: "Post 8 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 9,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=9",
    excerptTitle: "Post 9 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 10,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=10",
    excerptTitle: "Post 10 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 11,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=11",
    excerptTitle: "Post 11 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 12,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=12",
    excerptTitle: "Post 12 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 13,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=13",
    excerptTitle: "Post 13 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 14,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=14",
    excerptTitle: "Post 14 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 15,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=15",
    excerptTitle: "Post 15 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 16,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=16",
    excerptTitle: "Post 16 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 17,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=17",
    excerptTitle: "Post 17 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 18,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=18",
    excerptTitle: "Post 18 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 19,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=19",
    excerptTitle: "Post 19 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 20,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=20",
    excerptTitle: "Post 20 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 21,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=21",
    excerptTitle: "Post 21 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 22,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=22",
    excerptTitle: "Post 22 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 23,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=23",
    excerptTitle: "Post 23 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 24,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=24",
    excerptTitle: "Post 24 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 25,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=25",
    excerptTitle: "Post 25 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 26,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=26",
    excerptTitle: "Post 26 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 27,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=27",
    excerptTitle: "Post 27 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 28,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=28",
    excerptTitle: "Post 28 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {    
    postID: 29,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=29",
    excerptTitle: "Post 29 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 30,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=30",
    excerptTitle: "Post 30 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  },
  {
    postID: 31,
    excerptImage: "https://source.unsplash.com/random/200x200?sig=31",
    excerptTitle: "Post 31 Title",
    excerptDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    isFeaturePost: false
  }
];