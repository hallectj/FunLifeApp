import { Component, ElementRef, ViewChild } from '@angular/core';
import { LOADINGSPINNER } from 'src/app/common/base64Assests';
import { ICelebCard, ICelebrity, IDateObj, IFamousBirths } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-celebrity',
  templateUrl: './celebrity.component.html',
  styleUrls: ['./celebrity.component.scss']
})

export class CelebrityComponent {
  constructor(public service: GeneralService){}

  public dateObj: IDateObj = this.service.populateDateObj();
  public yesterday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1);
  public tomorrow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1);
  public today = new Date();

  public dateObjTomorow: IDateObj = null;
  public dateObjYesterday: IDateObj = null;

  public todayCelebCards: ICelebCard[] = [];
  public restOfTodayCelebCards: ICelebCard[] = [];
  public tomorrowCelebCards: ICelebCard[] = [];
  public yesterdayCelebCards: ICelebCard[] = [];
  
  public todayCelebBirths: ICelebrity[] = [];
  public tomorrowCelebBirths: ICelebrity[] = [];
  public yesterdayCelebBirths: ICelebrity[] = [];
  public famousPeopleResp: IFamousBirths[] = [];
  public initCelebCardsLen: number = 6;
  public restOfTodayCelebsLength: number = 0;
  public isExpanded: boolean = false;
  @ViewChild('expandButton') public expandButton: ElementRef<HTMLDivElement>;

  public async ngOnInit(){
    this.yesterday.setHours(0, 0, 0, 0);
    this.tomorrow.setHours(0, 0, 0, 0);
    this.today.setHours(0, 0, 0, 0);

    this.dateObjTomorow = this.service.populateDateObj(this.tomorrow);
    this.dateObjYesterday = this.service.populateDateObj(this.yesterday);

    this.todayCelebCards = this.createDummyCards(6, "large", 6);
    this.tomorrowCelebCards = this.createDummyCards(8, "small", 8);
    this.yesterdayCelebCards = this.createDummyCards(8, "small", 8);

    const date1 = this.constructSparqlDate(this.dateObjYesterday);
    const date2 = this.constructSparqlDate(this.dateObj);
    const date3 = this.constructSparqlDate(this.dateObjTomorow);

    await this.getResponses(date1, date2, date3, 80);
    this.todayCelebCards = [];
    this.tomorrowCelebCards = [];
    this.yesterdayCelebCards = [];

    let array = this.famousPeopleResp;

    let unique = array.filter((e, i) => array.findIndex(a => a.personLabel === e.personLabel) === i)

    unique = unique.filter((v: IFamousBirths) => v.occupations.every((occ) => !this.service.containsBadWord(occ)));


    const filteredBirthdays = this.filterBirthdaysByDate(unique);

    this.todayCelebBirths = this.mapICelebrity(filteredBirthdays, "today");
    this.tomorrowCelebBirths = this.mapICelebrity(filteredBirthdays, "tomorrow");
    this.yesterdayCelebBirths = this.mapICelebrity(filteredBirthdays, "yesterday");

    this.todayCelebCards = this.constructCards(this.todayCelebBirths, "large", true, -1);
    this.tomorrowCelebCards = this.constructCards(this.tomorrowCelebBirths, "small", false, 8);
    this.yesterdayCelebCards = this.constructCards(this.yesterdayCelebBirths, "small", false, 8);
  }

  private constructSparqlDate(dateObj: IDateObj): string {
    const d = (dateObj.date.getMonth()+1).toString().padStart(2,"0") + "-" + (dateObj.date.getDate()).toString().padStart(2, "0");
    return d;
  }

  private createDummyCards(len: number, size: string, dispAmt: number) : ICelebCard[] {
    //create dummy cards first so something is on the page
    let dummyCard: ICelebCard[] = [];

    for(let i = 0; i<len; i++){
      const obj: ICelebCard = {
        size: size,
        medalColor: "gold",
        image: LOADINGSPINNER,
        showSkills: true,
        celebPopularity: 0,
        celebInfo: {name: "LOADING", age: 0, occupations: []}
      }
      dummyCard.push(obj);
    }
    return dummyCard.splice(0, dispAmt)
  }

  private mapICelebrity(filteredBirths: {yesterday: IFamousBirths[], today: IFamousBirths[], tomorrow: IFamousBirths[]}, timeProp: string): ICelebrity[] {
    let iCelebrityArr: ICelebrity[] = [];
    iCelebrityArr = filteredBirths[timeProp].map((v: IFamousBirths) => ({
      name: v.personLabel,
      birthdate: new Date(v.birthdate),
      followerCount: v.followerCount,
      image: v.image,
      occupations: v.occupations.splice(0, 4)
    }))

    return iCelebrityArr;
  }

  private constructCards(arr: ICelebrity[], cardSize: string, showSkills: boolean, dispAmt: number){
    let cards: ICelebCard[] = [];
    for(let i = 0; i<arr.length; i++){
      const c = arr[i];
      const card: ICelebCard = {
        image: c.image,
        size: cardSize,
        celebPopularity: (i+1),
        showSkills: showSkills,
        medalColor: "gold",
        celebInfo: {name: c.name, age: this.calculateAge(c.birthdate), occupations: c.occupations}
      }
      cards.push(card);
    }

    if(dispAmt === -1){
      return cards;
    }else{
      return cards.splice(0, dispAmt);
    }
  }

  private filterBirthdaysByDate(birthdayArray: IFamousBirths[]) {
    return {
      yesterday: birthdayArray.filter(v => this.isSameMonthAndDay(v.birthdate, this.yesterday.toISOString())),
      today: birthdayArray.filter(v => this.isSameMonthAndDay(v.birthdate, this.today.toISOString())), 
      tomorrow: birthdayArray.filter(v => this.isSameMonthAndDay(v.birthdate, this.tomorrow.toISOString())), 
    }
    
  }
  
  private isSameMonthAndDay(isoDate1: string, isoDate2: string) {
    const obj1 = this.service.getMonthAndDayFromISOString(isoDate1);
    const obj2 = this.service.getMonthAndDayFromISOString(isoDate2);
    let month1 = obj1.month, day1 = obj1.day;
    let month2 = obj2.month, day2 = obj2.day;
    return (
      month1 === month2 && day1 === day2
    );
  }

  private calculateAge(dateOfBirth: Date) {
    var currentDate = new Date();
    var birthDate = new Date(dateOfBirth);
    
    var age = currentDate.getFullYear() - birthDate.getFullYear();
    
    // Check if the birthday has occurred this year
    if (currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  public async getResponses(d1: string, d2: string, d3: string, limit: number){
    const dateISO: string = this.dateObj.date.toISOString().split("T")[0];
    if(localStorage.getItem("featureDateISO")){
      const localDateISO: string = JSON.parse(localStorage.getItem('featureDateISO'));
      const isEqualDateISO = JSON.stringify(dateISO) === JSON.stringify(localDateISO);
      if(isEqualDateISO){
        let h = localStorage.getItem("all_celebs");
        if(h && h !== "null"){
          this.famousPeopleResp = JSON.parse(h);
        }else{
          this.famousPeopleResp = await this.service.getFamousPeopleByThreeDates(d1, d2, d3, limit).toPromise();
          localStorage.setItem("all_celebs", JSON.stringify(this.famousPeopleResp));
        }
      }else{
        localStorage.setItem("featureDateISO", JSON.stringify(dateISO));
        this.famousPeopleResp = await this.service.getFamousPeopleByThreeDates(d1, d2, d3, limit).toPromise();
        localStorage.setItem("all_celebs", JSON.stringify(this.famousPeopleResp));
      }
    }else{
      localStorage.setItem("featureDateISO", JSON.stringify(dateISO));
      this.famousPeopleResp = await this.service.getFamousPeopleByThreeDates(d1, d2, d3, limit).toPromise();
      localStorage.setItem("all_celebs", JSON.stringify(this.famousPeopleResp));
    }
  }

  public expandCelebDivFunc(){
    if (this.isExpanded) {
      this.expandButton.nativeElement.textContent = "Show More Celebrities Born Today";
      setTimeout(() => {
        window.scrollTo({ top: this.expandButton.nativeElement.clientHeight, behavior: 'smooth' });
      });
    } else {
      this.expandButton.nativeElement.textContent = "Show Less Celebrities Born Today";
      const container = document.getElementsByClassName('card-container')[0] as HTMLDivElement;
      setTimeout(() => {
        window.scrollTo({ top: Math.floor(container.clientHeight * 0.80), behavior: 'smooth' });
      });
      
    }

    this.isExpanded = !this.isExpanded;
  }
}
