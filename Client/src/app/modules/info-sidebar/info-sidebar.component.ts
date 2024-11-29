import { Component, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { slugify } from '../../..//app/common/Toolbox/util';
import { IFamousQuote, ISong, ISong2, IToy } from '../../../app/models/shared-models';
import { GeneralService } from '../../../app/services/general.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.scss']
})

export class InfoSidebarComponent {
  //ALL songs
  public songs: ISong2[] = [];
  public toys: IToy[] = [];
  public displayToy: IToy = {toy: "", image: "", image_source: "", image_source_url: "", year: 1999, description: "", price: 0};
  public famousQuote: IFamousQuote = {
    __v: 0,
    _id: "",
    authorImage: "",
    quoteAuthor: "",
    quoteGenre: "",
    quoteText: ""
  }
  public famousQuote2: {q: string, a: string, h: string} = {
    q: "", a: "", h: ""
  }
  //Songs filtered by year and longest number one song
  public songsByYearArr: ISong2[] = [];

  @Input() randomYear: string = "1990";
  @Input() isRandomPositions: boolean = false;
  @Input() hideToys: boolean = false;
  @Input() hideQuote: boolean = false;
  @Input() orderByPosition: string = "position";
  @Input() showAlternateTitle: boolean = false;

  public subscription: Subscription = new Subscription();
  
  public isBrowser: boolean = false;

  constructor(
    public generalService: GeneralService, 
    public route: ActivatedRoute, 
    public router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ){
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public async ngOnInit(){
    let year = 1990;
    if(this.isBrowser){
      const mainURL = window.location.href;
      year = this.extractYearFromUrl(mainURL);
    }
  
    if(!!year && year.toString().length === 4 && /[0-9]{4}/g.test(year.toString())){
      this.randomYear = year.toString();
    }
  
    await this.callSongsAPI(this.randomYear);
  
    if(!this.hideToys){
      this.toys = await this.generalService.getToys().toPromise();
      this.displayToy = this.toyByYear(+this.randomYear);
    }
  
    if(!this.hideQuote){
      const quote = await this.generalService.getRandomQuote2().toPromise();
      if(quote.length > 0 && quote[0]?.q !== ""){
        this.famousQuote2 = quote[0];
      }
    }
  
    this.subscription.add(this.generalService.subscribeToSidebarRefresh().subscribe(async (year: number) => {
      await this.callSongsAPI(year.toString());
      this.randomYear = year.toString();
    }));
  }

  public onClickedSong(song: ISong2){
    const route = ["/charts/hot-hundred-songs/" + song.year + "/" + song.position + "/artist/" +  slugify(song.artist) + "/song/" + slugify(song.song)];
    this.router.navigate(route);
  }

  private toyByYear(year: number) : IToy {
    let toy: IToy = {toy: "", image: "", image_source: "", image_source_url: "", year: year, description: "", price: 0};
    const idx = this.toys.findIndex(v => v.year === year);
    if(idx !== -1){
      toy = this.toys[idx];      
      this.displayToy.image_source
    }
    return toy;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  public onToyClick(){
    const route = ['/toys'];
    this.router.navigate(route);
  }

  public async callSongsAPI(year: string){
    this.songs = null;
    this.songs = [];
    this.songsByYearArr = null;
    this.songsByYearArr = [];

    const response2: ISong2[] = await this.generalService.getSongs(+year, this.orderByPosition, 10).toPromise();

    this.songs = response2;
    this.songsByYearArr = response2;
  }

  private extractYearFromUrl(url: string) {
    // Regular expression to match a sequence of four digits representing the year
    const regex = /\/hot-hundred-songs\/(\d{4})\/?/;
    const match = url.match(regex);
    // Check if a match is found
    if (match && match[1]) {
      return parseInt(match[1], 10);
    } else {
      return null;
    }
  }
}
