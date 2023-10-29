import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LOADINGSPINNER } from 'src/app/common/base64Assests';
import { IHistEvent, IPostExcerpt } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-day-in-history',
  templateUrl: './day-in-history.component.html',
  styleUrls: ['./day-in-history.component.scss']
})
export class DayInHistoryComponent {
  public currentMonth: string = "";
  public currentDay: string = "";
  public monthShorthand: string = "";
  public isHistoryLoading: boolean = false;
  //public today: Date = new Date();
  public previousMonth: string = "";  //could be this month,
  public nextMonth: string = ""; //could be this month
  //doesn't matter as much, just as long as I use a leap year, could be any leap year really.
  //This will matter when and if I use a calendar object, then the year MUST be the current year
  public defaultYear: string = "1984"  
  public isAccordianOpen: boolean = false;
  public loadingImg = LOADINGSPINNER;

  public monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  public monthToDays = {
    January: 31,
    February: 29,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  public datesRange: number[] = [];
  public previousDay: string = "";
  public nextDay: string = ""

  public dispHistory: {post: IPostExcerpt, useRibbon: boolean, year: number}[] = [];
  public historyEvents: IHistEvent[] = [];
  public selectedHistoryEvent: IHistEvent = {
    description: "",
    year: 100, 
    imageURL: "",
    wikiURL: "",
    title: "",
    noImageFound: true    
  }

  @ViewChild('calendar') calendar!: ElementRef<HTMLDivElement>; 

  constructor(public route: ActivatedRoute, public router: Router, public service: GeneralService){}

  public applyStyles(index: number){
    if(index + 1 === +this.currentDay){
      return {
        'font-weight': 'bold',
        'border': '2px solid black',
        'border-radius': '5px'
      }
    }
    return {};
  }

  public pickTheDate(d: number){
    this.currentDay = d.toString();
    const route = ['/day-in-history/' + this.currentMonth + "/" + this.currentDay];
    this.router.navigate(route);
  }

  public ngOnInit(){
    this.route.paramMap.subscribe(async params => {
      this.isHistoryLoading = true;
      const histDay = params.get("day");
      const histMonth = params.get("month");

      this.currentMonth = histMonth;
      this.currentDay = histDay;

      const prevDateObj = this.getPreviousDateInfo();
      this.previousDay = prevDateObj.previousDay;
      this.previousMonth = prevDateObj.previousMonth;
      
      const nextDateObj = this.getNextDateInfo();
      this.nextDay = nextDateObj.nextDay;
      this.nextMonth = nextDateObj.nextMonth;
      this.datesRange = Array(this.monthToDays[this.currentMonth]).fill(0).map((x,i)=>i+1);

      await this.getHistoryEvents();
      this.isHistoryLoading = false;
    });
  }

  public async getHistoryEvents(){
    const histDate = new Date(this.currentMonth + " " + this.currentDay + "," + this.defaultYear);
    this.historyEvents = await this.service.getEvents(histDate).toPromise();

    this.dispHistory = this.historyEvents.map((v: IHistEvent) => (
      {
        post: {
          postID: -1,
          excerptDesc: v.description,
          excerptImage: v.imageURL, 
          excerptTitle: v.title,
          isFeaturePost: false
        }, 
        useRibbon: true,
        year: v.year
      }
    ));
  }

  public getPreviousDateInfo(): {previousDay: string, previousMonth: string}{
    const today = new Date(this.currentMonth + " " + this.currentDay + "," + this.defaultYear);
    const previousDate = new Date(today.setDate(today.getDate() -1));
    const previousDay = previousDate.getDate().toString();
    const previousMonth = this.monthNames[previousDate.getMonth()];
    return {previousMonth, previousDay};    
  }

  public getPreviousHistoryDayEvent(){
    this.router.navigate(['/day-in-history/' + this.previousMonth + "/" + this.previousDay]);
  }

  public getNextHistoryDayEvent(){
    this.router.navigate(['/day-in-history/' + this.nextMonth + "/" + this.nextDay]);
  }

  public getNextDateInfo(): {nextDay: string, nextMonth: string}{
    const today = new Date(this.currentMonth + " " + this.currentDay + "," + this.defaultYear);
    const nextDate = new Date(today.setDate(today.getDate() +1));
    const nextDay = nextDate.getDate().toString();
    const nextMonth = this.monthNames[nextDate.getMonth()];
    return {nextMonth, nextDay};
  }

  public toggleAccordian(){
    this.isAccordianOpen = !this.isAccordianOpen;
    if (this.calendar.nativeElement.classList.contains('active')) {
      this.calendar.nativeElement.style.maxHeight = '0';
      this.calendar.nativeElement.classList.remove('active');
    } else {
      this.calendar.nativeElement.style.maxHeight = (this.calendar.nativeElement.scrollHeight + 20) + 'px';
      this.calendar.nativeElement.classList.add('active');
    }
  }


}
