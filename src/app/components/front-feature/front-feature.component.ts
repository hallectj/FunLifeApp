import { Component } from '@angular/core';
import { Inflation } from 'src/app/models/shared-models';

@Component({
  selector: 'front-feature',
  templateUrl: './front-feature.component.html',
  styleUrls: ['./front-feature.component.scss']
})
export class FrontFeatureComponent {
  public celebImg: string = "https://dims.apnews.com/dims4/default/27fcf74/2147483647/strip/true/crop/2192x1624+0+0/resize/599x444!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F64%2Fde%2F08e7c48f426f68098137900e4b59%2F12d2372949ba4ec594579c2bb761ee12";

  public dayInHistoryImg: string = "https://airandspace.si.edu/sites/default/files/styles/callout_half/public/images/editoral-stories/thumbnails/11878h.jpg";


  public todayDateAndMonth = "";
  public inflationObj: Inflation = {
    currency: "USD",
    year: "1943",
    gas: "0.21",
    bread: "0.10",
    movie_ticket: "0.25",
    car: "950.00"
  }

  constructor(){}

  public ngOnInit(){
    let date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.todayDateAndMonth = months[date.getMonth()] + " " + date.getDate();
  }
}
