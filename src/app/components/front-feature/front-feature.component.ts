import { Component, Input } from '@angular/core';
import { combineLatest, lastValueFrom, map } from 'rxjs';
import { IPresident, Inflation } from 'src/app/models/shared-models';
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

  public famousBirths: any;
  public histEvents: any;
  public presidents: any;

  public dateObj: {date: Date, day: string, month: string, monthName: string, year: string} = {
    date: new Date(), day: "", month: "", monthName: "", year: ""
  }

  constructor(private service: GeneralService){}

  private populateDateObj() {
    let date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[date.getMonth()];
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();
    if(month.length === 1) month = "0" + month;
    if(day.length === 1) day = "0" + day;
    const year = this.randomYear;
    return {date, day, month, monthName, year}
  }

  public async ngOnInit(){
    this.dateObj = this.populateDateObj();
    
    if(localStorage.getItem("featureDate")){
      const localDate = new Date(JSON.parse(localStorage.getItem("featureDate")));
      if(localDate.getDate() === this.dateObj.date.getDate() && localDate.getMonth() === this.dateObj.date.getMonth()){
        let f = localStorage.getItem("famousBirths");
        let p = localStorage.getItem("presidents");
        let h = localStorage.getItem("histEvents");
        if(f && p && h){
          this.famousBirths = JSON.parse(f);
          this.presidents = JSON.parse(p);
          this.histEvents = JSON.parse(h);
        }else{
          const responses = await lastValueFrom(this.initData());      
          localStorage.setItem("famousBirths", JSON.stringify(responses.famousBirths));
          localStorage.setItem("presidents", JSON.stringify(responses.presidents));
          localStorage.setItem("histEvents", JSON.stringify(responses.histEvents));
        }
      }else{
        localStorage.setItem("featureDate", JSON.stringify(this.dateObj.date));
        const responses = await lastValueFrom(this.initData());
        this.histEvents = responses.histEvents;
        this.famousBirths = responses.famousBirths;
        this.presidents = responses.presidents;

        localStorage.setItem("famousBirths", JSON.stringify(responses.famousBirths));
        localStorage.setItem("presidents", JSON.stringify(responses.presidents));
        localStorage.setItem("histEvents", JSON.stringify(responses.histEvents));
      }
    }else{
      localStorage.setItem("featureDate", JSON.stringify(this.dateObj.date));
      const responses = await lastValueFrom(this.initData());
      this.histEvents = responses.histEvents;
      this.famousBirths = responses.famousBirths;
      this.presidents = responses.presidents;

      localStorage.setItem("famousBirths", JSON.stringify(responses.famousBirths));
      localStorage.setItem("presidents", JSON.stringify(responses.presidents));
      localStorage.setItem("histEvents", JSON.stringify(responses.histEvents));
    }

    let randEventIndex = Math.floor(Math.random() * this.histEvents.length);
    this.histEvtImg = this.histEvents[randEventIndex]?.pages[0]?.originalimage?.source;
    let giveUpCount = 0;
    //sometimes there is no image from wikipedia, in that case try ten times until we get one
    if(!this.histEvtImg){
      while(giveUpCount < 10){
        let random = Math.floor(Math.random() * this.histEvents.length);
        this.histEvtImg = this.histEvents[random]?.pages[0]?.originalimage?.source;
        giveUpCount += 1;
        //if we have an image break out
        if(this.histEvtImg){
          break;
        }
      }
    }


    const celeb = this.famousBirths[0];
    this.celebImg = celeb.uniqueImage.value;
    this.celebName = celeb.personLabel.value;

    const president = this.presidentByYear(this.presidents, this.dateObj.year);
    this.presidentPortrait = president.portraitURL;
    this.loading = false;
    
  }

  public initData(){
    const observable = combineLatest({
      histEvents: this.service.callWikiAPI(this.dateObj.date, "events"),
      famousBirths: this.service.getFamousPeopleByDate(this.dateObj.month, this.dateObj.day, 20),
      presidents: this.service.getPresidents()
    });

    return observable.pipe(
      map(({ histEvents, famousBirths, presidents }) => {
        return {
          histEvents: histEvents.events,
          famousBirths: famousBirths.results.bindings,
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

  public whichChildBtnWasClicked(componentPath: string){
    if(componentPath === '/celebrity'){

      this.service.sendCelebInfo(this.famousBirths);
    }
  }
}
