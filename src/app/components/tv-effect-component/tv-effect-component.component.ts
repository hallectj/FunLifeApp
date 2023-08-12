import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ISport } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

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
  public sportsInterval = null;

  public sportEmoji: string = "&#127944;"  //football


  public sportsArrFromServer: ISport[] = [];
  public sportsIndex: number = 0;

  public sportObj: ISport = {
    sport: "",
    winner: "",
    loser: "",
    title: "",
    series: "",
    score: ""
  }

  constructor(private service: GeneralService){}

  public async ngOnInit(){
    const response = await this.service.getSportsByYear(this.randomYear).toPromise();
    this.sportsArrFromServer = response;
    if(this.sportsArrFromServer && this.sportsArrFromServer.length > 0){
      const nflIdx = this.sportsArrFromServer.findIndex(v => v.sport.toUpperCase() === "NFL");
      if(nflIdx !== -1){
        const nflObj = this.sportsArrFromServer[nflIdx];
        this.sportObj = nflObj;
      }
    }
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
      this.sportTextSlider(5000);
    }, 1000);
  }

  public clearSportsInterval(){
    clearInterval(this.sportsInterval);
  }

  public resumeInterval(){
    this.sportTextSlider(5000);
  }

  public sportTextSlider(speed: number){
    this.sportsInterval = setInterval(() => {
      let sports = ["NFL", "NBA", "MLB", "NHL"];
      if(this.sportsIndex === sports.length){
        this.sportsIndex = 0;
      }
      this.onSportClick(sports[this.sportsIndex]);
      this.sportsIndex++;
    }, speed)
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
    const sportObjIdx = this.sportsArrFromServer.findIndex(v => v.sport.toUpperCase() === sport.toUpperCase());
    let sportsObj: ISport = null;
    if(sportObjIdx !== -1){
      sportsObj = this.sportsArrFromServer[sportObjIdx];
      this.sportObj = sportsObj;
      this.sportObj.sport = this.sportsArrFromServer[sportObjIdx].sport.toUpperCase();
    }

    if(sport === "NFL"){
      this.sportEmoji = "&#127944;";
    }else if(sport === "NBA"){
      this.sportEmoji = "&#127936;"
    }else if(sport === "MLB"){
      this.sportEmoji = "&#9918;";
    }else if(sport === "NHL"){
      this.sportEmoji = "&#127954;";
    }
  }
}
