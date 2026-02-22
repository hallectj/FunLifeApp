import { Component, ElementRef, ViewChild } from '@angular/core';
import { LOADINGSPINNER } from '../../../app/common/base64Assests';
import { ICelebCard, ICelebrity, IDateObj } from '../../../app/models/shared-models';
import { GeneralService } from '../../../app/services/general.service';
import { firstValueFrom } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-celebrity',
  templateUrl: './celebrity.component.html',
  styleUrls: ['./celebrity.component.scss']
})

export class CelebrityComponent {
  constructor(
    public service: GeneralService, 
    private title: Title,
    private meta: Meta
  ){}

  //This will always be today's date only, do not change this
  public updatedDate = new Date()

  public dateObj: IDateObj = this.service.populateDateObj();
  public yesterday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1);
  public tomorrow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1);
  public today = new Date();
  public todayDateNum = 1;

  public dateObjTomorow: IDateObj = null;
  public dateObjYesterday: IDateObj = null;

  public todayCelebCards: ICelebCard[] = [];
  public restOfTodayCelebCards: ICelebCard[] = [];
  public tomorrowCelebCards: ICelebCard[] = [];
  public yesterdayCelebCards: ICelebCard[] = [];
  
  public todayCelebBirths: ICelebrity[] = [];
  public tomorrowCelebBirths: ICelebrity[] = [];
  public yesterdayCelebBirths: ICelebrity[] = [];
  public initCelebCardsLen: number = 6;
  public restOfTodayCelebsLength: number = 0;
  public isExpanded: boolean = false;
  public randomYear: string = "1999";
  @ViewChild('expandButton') public expandButton: ElementRef<HTMLDivElement>;

  public setDatesFunction(dateNum: number){
    const d = new Date(new Date().getFullYear(), new Date().getMonth(), dateNum);
    this.dateObj = this.service.populateDateObj(d);
    this.yesterday = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1);
    this.tomorrow = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);
    this.today = new Date(d);
  }

  public async ngOnInit(){
    this.title.setTitle("Celebrities Born this day");
    this.meta.updateTag({name: "description", content: "Find out which celebrities were born this month or any day of this month."})
    
    
    this.title.setTitle(`celebrities Birthday & Facts | Find Celebrities Born on Your Birthday`);
      
    // Enhanced meta description targeting the keyphrase
    this.meta.updateTag({
      name: "description", 
      content: `Discover which celebrity shares your birthday! Explore detailed facts, career highlights, and find other celebrities born on the same day!`
    });
    
    // Add relevant keywords targeting birthday-related searches
    this.meta.updateTag({
      name: "keywords", 
      content: "celebrity same birthday as me, celebrities born today, celebrities born tomorrow, celebrities born yesterday, which celebrities born this month, celebrities born on my birthday, famous people same birthday, celebrity birth date search, celebrity birthday matches, facts about celebrities"
    });
    
    // Enhance social sharing meta tags
    this.meta.updateTag({
      property: "og:title", 
      content: `Find Celebrities Who Share Your Birthday or Any Other Day | Celebrity Birthdays`
    });
    this.meta.updateTag({
      property: "og:description", 
      content: `Explore celebrity birthdays, life facts, and discover other famous people born on the same day. Your celebrity birthday twin awaits!`
    });
    this.meta.updateTag({property: "og:type", content: "website"});
    
    // Add Twitter Card tags
    this.meta.updateTag({name: "twitter:card", content: "summary_large_image"});
    this.meta.updateTag({
      name: "twitter:description", 
      content: `Find out what celebrity shares your birthday! Explore celebrity facts and discover who shares your birthday!`
    });
    
    
    this.randomYear = (Math.floor(Math.random() * (2020 - 1950 + 1) + 1950)).toString();

    this.todayDateNum = this.today.getDate();
    await this.getAllThingsCelebrity(this.todayDateNum);
  }

  public async pickedDate(dateNum: number){
    this.todayDateNum = dateNum;
    await this.getAllThingsCelebrity(this.todayDateNum);
  }

  public async getAllThingsCelebrity(dateNum: number){
    this.setDatesFunction(dateNum);
    await this.runMain();
  }

  public async runMain(){
    this.yesterday.setHours(0, 0, 0, 0);
    this.tomorrow.setHours(0, 0, 0, 0);
    this.today.setHours(0, 0, 0, 0);

    this.dateObjTomorow = this.service.populateDateObj(this.tomorrow);
    this.dateObjYesterday = this.service.populateDateObj(this.yesterday);

    this.todayCelebCards = this.createDummyCards(6, "large", 6);
    this.tomorrowCelebCards = this.createDummyCards(8, "small", 8);
    this.yesterdayCelebCards = this.createDummyCards(8, "small", 8);


    this.todayCelebCards = [];
    this.tomorrowCelebCards = [];
    this.yesterdayCelebCards = [];
    
    const datesets = [
      this.dateObjYesterday.month + "-" + this.dateObjYesterday.day,
      this.dateObj.month + "-" + this.dateObj.day,
      this.dateObjTomorow.month + "-" + this.dateObjTomorow.day,
    ]

    const yesterdayCelebs: ICelebrity[] = await firstValueFrom(this.service.getCelebrityByDateSet(datesets[0]));
    const todayCelebs: ICelebrity[] = await firstValueFrom(this.service.getCelebrityByDateSet(datesets[1]));
    const tomorrowCelebs: ICelebrity[] = await firstValueFrom(this.service.getCelebrityByDateSet(datesets[2]));

    const famousBirths: {yesterday: ICelebrity[], today: ICelebrity[], tomorrow: ICelebrity[]} = {
      yesterday: yesterdayCelebs,
      today: todayCelebs,
      tomorrow: tomorrowCelebs
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
      occupations: v.occupations.slice(0, 3)
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


  public getDaysInMonth() {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  }

  // Generate an array of numbers based on the number of days
  public generateArray() {
    const daysInMonth = this.getDaysInMonth();
    return new Array(daysInMonth).fill(0).map((_, index) => index + 1);
  }
}
