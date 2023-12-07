import { Component, Input } from '@angular/core';
import { combineLatest, lastValueFrom, map } from 'rxjs';
import { slugify } from '../../../app/common/Toolbox/util';
import { IDateObj, ICelebrity, IHistEvent, IPresident } from '../../../app/models/shared-models';
import { GeneralService } from '../../../app/services/general.service';

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
  public historyRoutePath = ""
  public presidentPortrait: string = "";
  public selectedPresidentNameSlugged: string = "";
  public selectedPresident: IPresident = {
    number: "",
    name: "",
    startDate: "",
    endDate: "",
    portraitURL: "",
    portraitDesc: "",
    portraitSource: "",
    party: "",
    birthCity: "",
    birthStateAbbr: "",
    birthdate: "",
    spouses: []
  }
  public loading: boolean = true;

  public famousBirths: ICelebrity[];
  public histEvents: IHistEvent[];
  public presidents: any;

  public dateObj: IDateObj = {
    date: new Date(), day: "", month: "", monthName: "", year: ""
  }

  constructor(private service: GeneralService){}

  public async ngOnInit(){
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setFullYear(+this.randomYear, date.getMonth(), date.getDate());
    this.dateObj = this.service.populateDateObj(date);

    this.historyRoutePath = "/day-in-history/" + this.dateObj.monthName + "/" + this.dateObj.day 
  
    const responses = await lastValueFrom(this.initData());
    this.famousBirths = responses.famousBirths;
    this.presidents = responses.presidents;
    this.histEvents = responses.histEvents;

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
    this.celebName = celeb.name;

    const president = this.presidentByYear(this.presidents, this.dateObj.year);
    this.selectedPresident = president;
    this.selectedPresidentNameSlugged = slugify(president.name);
    this.presidentPortrait = president.portraitURL;
    this.loading = false;
    
  }

  public initData(){
    const observable = combineLatest({
      histEvents: this.service.getEvents(this.dateObj.date),
      famousBirths: this.service.getCelebrityByDateSet(this.dateObj.month + '-' + this.dateObj.day),
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
    todayDate.setHours(0, 0, 0, 0);
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
