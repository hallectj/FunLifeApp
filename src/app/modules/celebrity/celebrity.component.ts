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
  public tomorrow = new Date(this.dateObj.today)
  public yesterday = new Date(this.dateObj.today)


  public dateObjTomorow: IDateObj = null;
  public dateObjYesterday: IDateObj = null;

  public todayCelebCards: ICelebCard[] = [];
  public restOfTodayCelebCards: ICelebCard[] = [];
  public tomorrowCelebCards: ICelebCard[] = [];
  public yesterdayCelebCards: ICelebCard[] = [];
  
  public todayCelebBirths: ICelebrity[] = [];
  public tomorrowCelebBirths: ICelebrity[] = [];
  public yesterdayCelebBirths: ICelebrity[] = [];
  public famousPeopleResp: any = null;
  public initCelebCardsLen: number = 6;
  public restOfTodayCelebsLength: number = 0;
  public isExpanded: boolean = false;
  @ViewChild('expandButton') public expandButton: ElementRef<HTMLDivElement>;

  public async ngOnInit(){
    this.yesterday.setDate(this.dateObj.today.getDate() - 1)
    this.yesterday.setHours(0, 0, 0, 0);
    
    this.tomorrow.setDate(this.dateObj.today.getDate() + 1)
    this.tomorrow.setHours(0, 0, 0, 0);
    
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

    const array = this.famousPeopleResp.results.bindings;
    let unique = array.filter((e, i) => array.findIndex(a => a.personLabel.value === e.personLabel.value) === i)

    unique = unique.filter( (v: any) => {
      const occ = v.occupations.value.split(",");
      for(let i = 0; i<occ.length; i++){
        if(this.containsBadWord(occ[i])){
          return false;
        }
        return true;
      }
      return false;
    }) 

    const filteredBirthdays = this.filterBirthdaysByDate(unique);

    this.todayCelebBirths = this.mapICelebrity(filteredBirthdays, "today");
    this.tomorrowCelebBirths = this.mapICelebrity(filteredBirthdays, "tomorrow");
    this.yesterdayCelebBirths = this.mapICelebrity(filteredBirthdays, "yesterday");

    this.todayCelebCards = this.constructCards(this.todayCelebBirths, "large", true, -1);
    this.tomorrowCelebCards = this.constructCards(this.tomorrowCelebBirths, "small", false, 8);
    this.yesterdayCelebCards = this.constructCards(this.yesterdayCelebBirths, "small", false, 8);

    this.service.subscribeToCelebInfo().subscribe((celebBirths: any) => {

    })
  }

  private constructSparqlDate(dateObj: IDateObj): string {
    return (dateObj.today.getMonth() + 1).toString().padStart(2,"0") + "-" + dateObj.today.getDate().toString().padStart(2, "0");
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

  private mapICelebrity(filteredBirths: any, timeProp: string): ICelebrity[] {
    let iCelebrityArr: ICelebrity[] = [];
    iCelebrityArr = filteredBirths[timeProp].map(v => ({
      name: v.personLabel.value,
      birthdate: new Date(v.birthdate.value),
      followerCount: +v.followers.value,
      image: v.uniqueImage.value,
      occupations: v.occupations.value.split(",").map(s => this.filterBadWords(s.trim())).splice(0, 4)
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

  private filterBirthdaysByDate(birthdayArray: any[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setHours(today.getUTCHours() - 6);
    yesterday.setUTCHours(0, 0, 0, 0);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setUTCHours(0, 0, 0, 0);
    tomorrow.setDate(today.getDate() + 1);
  
    return {
      yesterday: birthdayArray.filter(obj => this.isSameMonthAndDay(new Date(obj.birthdate.value), yesterday)),
      today: birthdayArray.filter(obj => this.isSameMonthAndDay(new Date(obj.birthdate.value), today)),
      tomorrow: birthdayArray.filter(obj => this.isSameMonthAndDay(new Date(obj.birthdate.value), tomorrow))
    };
  }
  
  private isSameMonthAndDay(date1: Date, date2: Date) {
    return (
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
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
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setUTCHours(0, 0, 0, 0);
    if(localStorage.getItem("featureDate")){
      const localDate = new Date(JSON.parse(localStorage.getItem("featureDate")));
      const equalDate = JSON.stringify(date) === JSON.stringify(localDate);
      if(equalDate){
        let h = localStorage.getItem("all_celebs");
        if(h && h !== "null"){
          this.famousPeopleResp = JSON.parse(h);
        }else{
          this.famousPeopleResp = await this.service.getFamousPeopleByThreeDates(d1, d2, d3, limit).toPromise();
          localStorage.setItem("all_celebs", JSON.stringify(this.famousPeopleResp));
        }
      }else{
        localStorage.setItem("featureDate", JSON.stringify(date));
        this.famousPeopleResp = await this.service.getFamousPeopleByThreeDates(d1, d2, d3, limit).toPromise();
        localStorage.setItem("all_celebs", JSON.stringify(this.famousPeopleResp));
      }
    }else{
      localStorage.setItem("featureDate", JSON.stringify(date));
      this.famousPeopleResp = await this.service.getFamousPeopleByThreeDates(d1, d2, d3, limit).toPromise();
      localStorage.setItem("all_celebs", JSON.stringify(this.famousPeopleResp));
    }
  }

  private filterBadWords(inputString: string) {
    const badWords = ['oral sex', 'sex', 'lesbianism', 'anal sex', 'vaginal intercourse', 'pornographic actor'];
    const pattern = new RegExp(badWords.join("|"), "gi");
    return inputString.replace(pattern, "****");
  }

  public containsBadWord(inputString) {
    const badWords = ['oral sex', 'sex', 'lesbianism', 'anal sex', 'vaginal intercourse', 'pornographic actor'];
    const pattern = new RegExp(badWords.join("|"), "gi");
    const hasBadWord = pattern.test(inputString);
    return hasBadWord;
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
