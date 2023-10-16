import { Component, ElementRef, ViewChild } from '@angular/core';
import { LOADINGSPINNER } from 'src/app/common/base64Assests';
import { ICelebCard, ICelebrity, IDateObj } from 'src/app/models/shared-models';
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
  public famousPeopleResp: { [date: string]: ICelebrity[] } | ICelebrity[];
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

    this.famousPeopleResp = await this.service.getCelebrityBirths(this.dateObj.date, true).toPromise() as { [date: string]: ICelebrity[] };

    this.todayCelebCards = [];
    this.tomorrowCelebCards = [];
    this.yesterdayCelebCards = [];

    const keys = Object.keys(this.famousPeopleResp);

    const famousBirths: {yesterday: ICelebrity[], today: ICelebrity[], tomorrow: ICelebrity[]} = {
      yesterday: this.famousPeopleResp[keys[0]],
      today: this.famousPeopleResp[keys[1]],
      tomorrow: this.famousPeopleResp[keys[2]]
    }

    this.todayCelebBirths = this.mapICelebrity(famousBirths, "today");
    this.tomorrowCelebBirths = this.mapICelebrity(famousBirths, "tomorrow");
    this.yesterdayCelebBirths = this.mapICelebrity(famousBirths, "yesterday");

    this.todayCelebCards = this.constructCards(this.todayCelebBirths, "large", true, -1);
    this.tomorrowCelebCards = this.constructCards(this.tomorrowCelebBirths, "small", false, 8);
    this.yesterdayCelebCards = this.constructCards(this.yesterdayCelebBirths, "small", false, 8);
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

  private mapICelebrity(filteredBirths: {yesterday: ICelebrity[], today: ICelebrity[], tomorrow: ICelebrity[]}, timeProp: string): ICelebrity[] {
    let iCelebrityArr: ICelebrity[] = [];
    iCelebrityArr = filteredBirths[timeProp].map((v: ICelebrity) => ({
      name: v.name,
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
        celebInfo: {name: c.name, age: this.calculateAge(new Date(c.birthdate)), occupations: c.occupations}
      }
      cards.push(card);
    }

    if(dispAmt === -1){
      return cards;
    }else{
      return cards.splice(0, dispAmt);
    }
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
