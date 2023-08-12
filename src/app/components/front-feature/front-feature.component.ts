import { Component, Input } from '@angular/core';
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
  public presidentDateStr: string = "";

  public presidentLoading: boolean = true;

  public todayDateAndMonth = "";
  public inflationObj: Inflation = {
    currency: "USD",
    year: "1943",
    gas: "0.21",
    bread: "0.10",
    movie_ticket: "0.25",
    car: "950.00"
  }

  constructor(private service: GeneralService){}

  public async ngOnInit(){
    let date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.todayDateAndMonth = months[date.getMonth()] + " " + date.getDate();
    this.presidentDateStr = this.todayDateAndMonth + ", " + this.randomYear;

    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();

    if(month.length === 1){
      month = "0" + month;
    }

    if(day.length === 1){
      day = "0" + day;
    }

    console.log(month, day);

    const histEvents = await this.service.callWikiAPI(date, "events").toPromise();
    console.log("histEvents", histEvents)

    let eventCount = histEvents.events.length;
    let randEventIndex = Math.floor(Math.random() * (eventCount - 0 + 1) + 0);
    console.log("randEventIndex", randEventIndex)

    this.histEvtImg = histEvents.events[randEventIndex].pages[0].originalimage.source;
    
    const famousBirths = await this.service.getFamousPeopleByDate(month, day).toPromise();
    console.log(famousBirths);

    const celeb = famousBirths.results.bindings[0];

    this.celebImg = celeb.uniqueImage.value;
    console.log("celebImg", celeb.uniqueImage.value);
    this.celebName = celeb.personLabel.value;

    const presidents = await this.service.getPresidents().toPromise();
    const president = this.presidentByYear(presidents, this.randomYear);
    this.presidentPortrait = president.portraitURL;
    this.presidentLoading = false;
    
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
