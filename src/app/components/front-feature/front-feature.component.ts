import { Component, Input } from '@angular/core';
import { combineLatest, lastValueFrom, map } from 'rxjs';
import { IDateObj, IFamousBirths, IHistEvent, IPresident, Inflation } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'front-feature',
  templateUrl: './front-feature.component.html',
  styleUrls: ['./front-feature.component.scss']
})
export class FrontFeatureComponent {
  @Input() randomYear: string = "";
  public celebImg: string = "";
  public celebName: string = "";
  public histEvtImg: string = "";
  public presidentPortrait: string = "";
  public loading: boolean = true;

  public famousBirths: IFamousBirths[];
  public histEvents: IHistEvent[];
  public presidents: any;

  public dateObj: IDateObj = {
    today: new Date(), day: "", month: "", monthName: "", year: ""
  }

  constructor(private service: GeneralService){}

  public async ngOnInit(){
    const date = new Date();
    date.setFullYear(+this.randomYear, date.getMonth(), date.getDate());
    this.dateObj = this.service.populateDateObj(date);
  
    await this.getResponses();

    let randEventIndex = Math.floor(Math.random() * this.histEvents.length);
    let randomHistEvent = this.histEvents[randEventIndex];

    this.histEvtImg = randomHistEvent.imageURL;
    let giveUpCount = 0;
    //sometimes there is no image from wikipedia, in that case try ten times until we get one
    if(randomHistEvent.noImageFound){
      while(giveUpCount < 10){
        let random = Math.floor(Math.random() * this.histEvents.length);
        this.histEvtImg = this.histEvents[random].imageURL;
        giveUpCount += 1;
        //if we have an image break out
        if(!this.histEvents[random].noImageFound){
          break;
        }
      }
    }


    const celeb = this.famousBirths[0];
    this.celebImg = celeb.image;
    this.celebName = celeb.personLabel;

    const president = this.presidentByYear(this.presidents, this.dateObj.year);
    this.presidentPortrait = president.portraitURL;
    this.loading = false;
    
  }

  public initData(){
    const observable = combineLatest({
      histEvents: this.service.getEvents(this.dateObj.today),
      famousBirths: this.service.getFamousPeopleByDate(this.dateObj.month, this.dateObj.day, "", 20),
      presidents: this.service.getPresidents()
    });

    return observable.pipe(
      map(({ histEvents, famousBirths, presidents }) => {
        return {
          histEvents: histEvents,
          famousBirths: famousBirths,
          presidents: presidents
        }
      })
    )
  }


  private presidentByYear(presArr: IPresident[], year: string): IPresident{
    const todayDate = new Date();
    let month = (todayDate.getMonth() + 1).toString();
    let day = (todayDate.getDate()).toString();
    
    const compareDate = new Date(month + "/" + day + "/" + year);
    const dateToCheckTimestamp = new Date(compareDate).getTime();

    for (const obj of presArr) {
      const startDateTimestamp = new Date(obj.startDate).getTime();
      const endDateTimestamp = new Date(obj.endDate).getTime();
  
      if (dateToCheckTimestamp >= startDateTimestamp && dateToCheckTimestamp <= endDateTimestamp) {
        return obj;
      }
    }
  
    return null;

  }

  public async getResponses(){
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    if(localStorage.getItem("featureDate")){
      const localDate = new Date(JSON.parse(localStorage.getItem("featureDate")));
      localDate.setHours(0, 0, 0, 0);
      const equalDates = JSON.stringify(date) === JSON.stringify(localDate);
      if(equalDates){
        let f = localStorage.getItem("famousBirths");
        let p = localStorage.getItem("presidents");
        let h = localStorage.getItem("histEvents");
        if((f && f !== 'null') && (p && p !== 'null') && (h && h !== 'null')){
          this.famousBirths = JSON.parse(f);
          this.presidents = JSON.parse(p);
          this.histEvents = JSON.parse(h);
        }else{
          const responses = await lastValueFrom(this.initData());  
          
          this.famousBirths = responses.famousBirths;
          this.presidents = responses.presidents;
          this.histEvents = responses.histEvents;

          localStorage.setItem("famousBirths", JSON.stringify(responses.famousBirths));
          localStorage.setItem("presidents", JSON.stringify(responses.presidents));
          localStorage.setItem("histEvents", JSON.stringify(responses.histEvents));
        }
      }else{
        localStorage.setItem("featureDate", JSON.stringify(date));
        const responses = await lastValueFrom(this.initData());

        this.famousBirths = responses.famousBirths;
        this.presidents = responses.presidents;
        this.histEvents = responses.histEvents;

        localStorage.setItem("famousBirths", JSON.stringify(responses.famousBirths));
        localStorage.setItem("presidents", JSON.stringify(responses.presidents));
        localStorage.setItem("histEvents", JSON.stringify(responses.histEvents));
      }
    }else{
      localStorage.setItem("featureDate", JSON.stringify(date));
      const responses = await lastValueFrom(this.initData());
      this.histEvents = responses.histEvents;
      this.famousBirths = responses.famousBirths;
      this.presidents = responses.presidents;

      localStorage.setItem("famousBirths", JSON.stringify(responses.famousBirths));
      localStorage.setItem("presidents", JSON.stringify(responses.presidents));
      localStorage.setItem("histEvents", JSON.stringify(responses.histEvents));
    }
  }

  public whichChildBtnWasClicked(componentPath: string){
    if(componentPath === '/celebrity'){

      this.service.sendCelebInfo(this.famousBirths);
    }
  }
}
