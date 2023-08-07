import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ISport } from 'src/app/models/shared-models';

@Component({
  selector: 'tv-effect-component',
  templateUrl: './tv-effect-component.component.html',
  styleUrls: ['./tv-effect-component.component.scss']
})
export class TvEffectComponentComponent {
	@ViewChild('main', {static: false}) main!: ElementRef<HTMLElement>;
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;
	@ViewChild('menu', {static: false}) menu!: ElementRef<HTMLDivElement>;
 	@ViewChild('text', {static: false}) text!: ElementRef<HTMLDivElement>;
	@ViewChild('innerDiv', {static: false}) innerDiv!: ElementRef<HTMLDivElement>;

  @Input() randomYear: string = "";

	public ctx: CanvasRenderingContext2D;
	public ww: number = 800;
	public idx: number = 0;
	public count: number = 0;
	public toggle: boolean = true;
	public frame: any;

  public sportEmoji: string = "&#127944;"  //football


  public sportObjFromServer = {
    sport: {
      nfl: {
        winner: "Los Angeles Raiders",
        loser: "Washington Redskins",
        score: "38-9",
        title: "Super Bowl XVIII",
        series: "1-0"
      },
      mlb: {
        winner: "Detroit Tigers",
        loser: "San Diego Padres",
        score: "8-4",
        title: "World Series",
        series: "4-1"
      },
      nhl: {
        winner: "Edmonton Oilers",
        loser: "New York Islanders",
        score: "5-2",
        title: "Stanley Cup",
        series: "4-1"
      },
      nba: {
        winner: "Boston Celtics",
        loser: "Los Angeles Lakers",
        score: "111-102",
        title: "NBA Championship",
        series: "4-3"
      }
    }

  }

  public sportObj: ISport = {
    sport: "NFL",
    winner: this.sportObjFromServer.sport.nfl.winner,
    loser: this.sportObjFromServer.sport.nfl.loser,
    title: this.sportObjFromServer.sport.nfl.title,
    series: this.sportObjFromServer.sport.nfl.series,
    score: this.sportObjFromServer.sport.nfl.score
  }

  public ngAfterViewInit(){
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.count = this.innerDiv.nativeElement.childElementCount - 1;
    this.canvas.nativeElement.width = this.ww / 3;
    this.canvas.nativeElement.height = (this.ww * 0.5625) / 3;	

    setTimeout(() => {
      this.main.nativeElement.classList.add('on');
      this.main.nativeElement.classList.remove('off');
      this.animate(this.ctx);
      this.glitchEffect();
    }, 1000);
  }


  public snow(ctx: CanvasRenderingContext2D) {
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    let d = ctx.createImageData(w, h);
    let b = new Uint32Array(d.data.buffer);
    let len = b.length;
  
    for (let i = 0; i < len; i++) {
      b[i] = ((255 * Math.random()) | 0) << 24;
    }

    ctx.putImageData(d, 0, 0);
  }

  public animate(ctx: CanvasRenderingContext2D) {
    this.snow(ctx);
    this.frame = requestAnimationFrame( () => this.animate(ctx));
  };

  private glitchEffect(){
    for (let i = 0; i < 4; i++) {
	    var span = this.text.nativeElement.firstElementChild.cloneNode(true);
	    this.text.nativeElement.appendChild(span);
    }
  }

  public onSportClick(sport: string){
    if(sport === "NFL"){
      this.sportEmoji = "&#127944;";
      this.sportObj = {
        sport: sport,
        winner: this.sportObjFromServer.sport.nfl.winner,
        loser: this.sportObjFromServer.sport.nfl.loser,
        title: this.sportObjFromServer.sport.nfl.title,
        series: this.sportObjFromServer.sport.nfl.series,
        score: this.sportObjFromServer.sport.nfl.score
      }
    }else if(sport === "NBA"){
      this.sportEmoji = "&#127936;"
      this.sportObj = {
        sport: sport,
        winner: this.sportObjFromServer.sport.nba.winner,
        loser: this.sportObjFromServer.sport.nba.loser,
        title: this.sportObjFromServer.sport.nba.title,
        series: this.sportObjFromServer.sport.nba.series,
        score: this.sportObjFromServer.sport.nba.score
      }
    }else if(sport === "MLB"){
      this.sportEmoji = "&#9918;";
      this.sportObj = {
        sport: sport,
        winner: this.sportObjFromServer.sport.mlb.winner,
        loser: this.sportObjFromServer.sport.mlb.loser,
        title: this.sportObjFromServer.sport.mlb.title,
        series: this.sportObjFromServer.sport.mlb.series,
        score: this.sportObjFromServer.sport.mlb.score
      }
    }else if(sport === "NHL"){
      this.sportEmoji = "&#127954;";
      this.sportObj = {
        sport: sport,
        winner: this.sportObjFromServer.sport.nhl.winner,
        loser: this.sportObjFromServer.sport.nhl.loser,
        title: this.sportObjFromServer.sport.nhl.title,
        series: this.sportObjFromServer.sport.nhl.series,
        score: this.sportObjFromServer.sport.nhl.score
      }
    }
  }
}
