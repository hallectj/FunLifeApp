import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public todayDateAndMonth = "";
  public inflationObj: {currency: string, year: string, gas: string, bread: string, movie_ticket: string, car: string} = {
    "currency": "USD",
    "year": "1943",
    "gas": "0.21",
    "bread": "0.10",
    "movie_ticket": "0.25",
    "car": "950.00"
  }
  
  constructor(){

  }

  public ngOnInit(){
    let date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.todayDateAndMonth = months[date.getMonth()] + " " + date.getDate();
  }
}
