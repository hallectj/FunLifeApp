import { Component } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public randomYear: string = "1990";
  
  constructor(public service: HomeService){}

  public ngOnInit(){
    this.randomYear = this.getRandomYear(1940, 2020).toString();
  }

  //years from 1940 to 2020
  private getRandomYear(min: number, max: number): number {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }
}
