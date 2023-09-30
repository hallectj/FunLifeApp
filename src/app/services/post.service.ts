import { Injectable } from '@angular/core';
import { Observable, Subject, delay, of } from 'rxjs';
import { IPostExcerpt } from '../models/shared-models';

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

  public getPost(){
    //Simulating post retrieval, will update when backend code is introduced.
    return of(examplePost).pipe(delay(4000));
  }

  public slugify(str: string){
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
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

//Example post I would get back from server, hardcode for now.
const examplePost = `
<article>
  <p>Andrei Arsenyevich Tarkovsky 4 April 1932[1] – 29 December 1986 was a Soviet filmmaker. Widely considered one of the greatest and most influential filmmakers of all time, his films explore <em>spiritual and metaphysical themes</em>, and are noted for their slow pacing and long takes, dreamlike visual imagery, and preoccupation with <em>nature and memory</em>.</p>
</article>

<article>
  <h2>Childhood and early life</h2>
  <p>Andrei Tarkovsky was born in the village of Zavrazhye in the Yuryevetsky District of the Ivanovo Industrial Oblast (modern-day Kadyysky District of the Kostroma Oblast, Russia) to the poet and translator <span class="link">Arseny Aleksandrovich Tarkovsky</span>, a native of Yelysavethrad (now Kropyvnytskyi, Ukraine), and Maria Ivanova Vishnyakova, a graduate of the <em>Maxim Gorky Literature Institute</em> who later worked as a corrector; she was born in Moscow in the Dubasov family estate.</p> 
  <img src="https://www.sensesofcinema.com/wp-content/uploads/2002/05/Andrei-Tarkovsky.png" alt="Andrei Tarkovsky Portrait">
  <p>According to the family legend, Tarkovsky's ancestors on his father's side were princes from the <span class="link">Shamkhalate of Tarki</span>, Dagestan, although his sister Marina Tarkovskaya who did a detailed research on their genealogy called it "a myth, even a prank of sorts," stressing that none of the documents confirms this version.</p>
</article>

<article>
  <h2>Film school student</h2>
  <p>Upon returning from the research expedition in 1954, Tarkovsky applied at the <em>State Institute of Cinematography 🎥</em> and was admitted to the film-directing program. He was in the same class as <em>Irma Raush</em> whom he married in April 1957.</p>
  <p>The early Khrushchev era offered good opportunities for young film directors. Before 1953, annual film production was low and most films were directed by veteran directors. After 1953, more films were produced, many of them by young directors. The Khrushchev Thaw relaxed Soviet social restrictions a bit and permitted a limited influx of European and North American literature, films and music. This allowed Tarkovsky to see films of the <span class="link">Italian neorealists</span>, <span class="link">French New Wave</span>, and of directors such as <em>Kurosawa</em>, <em>Buñuel</em>, <em>Bergman</em>, <em>Bresson</em>, <em>Wajda</em> (whose film Ashes and Diamonds influenced Tarkovsky) and <em>Mizoguchi</em>.</p> 
  <img src="https://mf.b37mrtl.ru/rbthmedia/images/web/en-rbth/images/2014-11/top/Tarkovsky-top.jpg" alt="Director Andrei Tarkovsky with a movie camera">
</article>

<div>
  <blockquote>
    <h3>💡 Inspiration</h3>
    <p>Tarkovsky was, according to fellow student Shavkat Abdusalmov, fascinated by <em>Japanese films</em>. He was amazed by how every character on the screen is exceptional and how everyday events such as a Samurai cutting bread with his sword are elevated to something special and put into the limelight. Tarkovsky has also expressed interest in <em>art of Haiku</em> and its ability to create "images in such a way that they mean nothing beyond themselves"</p>
  </blockquote>
</div>

<article>
  <h2>Famous Movies</h2>
  <p>Tarkovsky is mainly known as a film director. During his career he directed seven feature films, as well as three shorts from his time at VGIK. His features are:</p>
  <ul>
    <li>Ivan's Childhood (1962)</li>
    <li>Andrei Rublev (1966)</li>
    <li>Solaris (1972)</li>
    <li>Mirror (1975)</li>
    <li>Stalker (1979)</li>
    <li>Nostalghia (1983)</li>
    <li>The Sacrifice (1986)</li>
  </ul>

  <p>He also wrote several screenplays. Furthermore, he directed the play Hamlet for the stage in Moscow, directed the opera Boris Godunov in London, and he directed a radio production of the short story Turnabout by William Faulkner. He also wrote Sculpting in Time, a book on film theory.</p>
  <p>Tarkovsky's <em>first feature film</em> was Ivan's Childhood in 1962. He then directed Andrei Rublev in 1966, Solaris in 1972, Mirror in 1975 and Stalker in 1979. The documentary <em>Voyage in Time</em> was produced in Italy in 1982, as was Nostalghia in 1983. His last film The Sacrifice was produced in Sweden in 1986. Tarkovsky was personally involved in writing the screenplays for all his films, sometimes with a cowriter. Tarkovsky once said: <cite>"A director who realizes somebody else's screenplay without being involved in it becomes a mere illustrator, resulting in dead and monotonous films.""</cite></p> 
  <img src="https://faroutmagazine.co.uk/static/uploads/2021/06/5-shots-that-prove-Andrei-Tarkovsky-was-a-genius.jpg" alt="">
</article>
`;
