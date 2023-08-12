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
    
    const responses = await lastValueFrom(this.initData());

    const histEvents = responses.histEvents;
    const famousBirths = responses.famousBirths;
    const presidents = responses.presidents;

    let randEventIndex = Math.floor(Math.random() * histEvents.length);
    this.histEvtImg = histEvents[randEventIndex]?.pages[0]?.originalimage?.source;

    const celeb = famousBirths[0];
    this.celebImg = celeb.uniqueImage.value;
    this.celebName = celeb.personLabel.value;

    const president = this.presidentByYear(presidents, this.dateObj.year);
    this.presidentPortrait = president.portraitURL;
    this.loading = false;
    
  }

  public initData(){
    const observable = combineLatest({
      histEvents: this.service.callWikiAPI(this.dateObj.date, "events"),
      famousBirths: this.service.getFamousPeopleByDate(this.dateObj.month, this.dateObj.day),
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
}
