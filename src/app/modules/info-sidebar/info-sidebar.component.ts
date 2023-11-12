import { Component, Input } from '@angular/core';
import { IFamousQuote, ISong, ISong2, IToy } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

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
  //Songs filtered by year and longest number one song
  public songsByYearArr: ISong2[] = [];

  @Input() randomYear: string = "1990";
  
  constructor(public generalService: GeneralService){}

  public async ngOnInit(){
    const response2: ISong2[] = await this.generalService.getSongs(+this.randomYear, 10).toPromise();

    this.songs = response2;
    this.songsByYearArr = response2;

    this.toys = await this.generalService.getToys().toPromise();
    this.displayToy = this.toyByYear(+this.randomYear);

    const quote = await this.generalService.getRandomQuote().toPromise();
    if(quote && quote?.data && quote?.data.length > 0){
      this.famousQuote = quote.data[0];
    }
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
}
