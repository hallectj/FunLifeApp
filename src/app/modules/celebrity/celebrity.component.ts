import { Component } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

export interface ICelebCard{
  size: string,
  medalColor: string,
  image: string,
  showSkills: boolean,
  celebPopularity: number,
  celebInfo: {name: string, age: number, occupations: string[]}
};

export interface ICelebrity{
  name: string,
  birthdate: Date,
  followerCount: number,
  image: string,
  occupations: string[]
}

const TODAYCELEBLENGTH: number = 6;
const TOMORROWCELEBLENGTH: number = 8;
const YESTERDAYCELEBLENGTH: number = 8;

@Component({
  selector: 'app-celebrity',
  templateUrl: './celebrity.component.html',
  styleUrls: ['./celebrity.component.scss']
})

export class CelebrityComponent {
  constructor(public service: GeneralService){}

  public todayCelebCards: ICelebCard[] = [];
  public tomorrowCelebCards: ICelebCard[] = [];
  public yesterdayCelebCards: ICelebCard[] = [];
  
  public todayCelebBirths: ICelebrity[] = [];
  public tomorrowCelebBirths: ICelebrity[] = [];
  public yesterdayCelebBirths: ICelebrity[] = [];



  public async ngOnInit(){
    const testResp = await this.service.getFamousPeopleByDateRange("09", "03", "05", 40).toPromise();
    const array = testResp.results.bindings;
    let unique = array.filter((e, i) => array.findIndex(a => a.personLabel.value === e.personLabel.value) === i)

    const filteredBirthdays = this.filterBirthdaysByDate(unique);

    this.todayCelebBirths = filteredBirthdays.today.map(v => ({
      name: v.personLabel.value,
      birthdate: new Date(v.birthdate.value),
      followerCount: +v.followers.value,
      image: v.uniqueImage.value,
      occupations: v.occupations.value.split(",").map(s => s.trim()).splice(0, 4)
    }))

    this.tomorrowCelebBirths = filteredBirthdays.tomorrow.map(v => ({
      name: v.personLabel.value,
      birthdate: new Date(v.birthdate.value),
      followerCount: +v.followers.value,
      image: v.uniqueImage.value,
      occupations: v.occupations.value.split(",").map(s => s.trim()).splice(0, 4)
    }))

    this.yesterdayCelebBirths = filteredBirthdays.yesterday.map(v => ({
      name: v.personLabel.value,
      birthdate: new Date(v.birthdate.value),
      followerCount: +v.followers.value,
      image: v.uniqueImage.value,
      occupations: v.occupations.value.split(",").map(s => s.trim()).splice(0, 4)
    }))


    this.todayCelebCards = this.constructCards(this.todayCelebBirths, "large", true, TODAYCELEBLENGTH);

    this.tomorrowCelebCards = this.constructCards(this.tomorrowCelebBirths, "small", false, TOMORROWCELEBLENGTH);

    this.yesterdayCelebCards = this.constructCards(this.yesterdayCelebBirths, "small", false, YESTERDAYCELEBLENGTH);

    this.service.subscribeToCelebInfo().subscribe((celebBirths: any) => {

    })
  }

  private constructCards(arr: ICelebrity[], cardSize: string, showSkills: boolean, lengthMax: number){
    let cards: ICelebCard[] = [];
    for(let i = 0; i<arr.length; i++){
      if(i >= lengthMax) break;
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
    return cards;
  }

  private filterBirthdaysByDate(birthdayArray: any[]) {
    const today = new Date();
    today.setUTCHours(today.getUTCHours() - 6);
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
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
}
