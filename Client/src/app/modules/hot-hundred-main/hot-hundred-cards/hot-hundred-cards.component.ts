import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../../../app/services/general.service';
import { Title } from '@angular/platform-browser';

const STARTYEAR = 1950;
const ENDYEAR = 2025;

@Component({
  selector: 'app-hot-hundred-cards',
  templateUrl: './hot-hundred-cards.component.html',
  styleUrls: ['./hot-hundred-cards.component.scss']
})
export class HotHundredCardsComponent {
  public yearsRange = Array.from({ length: ENDYEAR - STARTYEAR + 1 }, (_, index) => STARTYEAR + index);
  public selectedYear: number = 1990;

  constructor(public service: GeneralService, public route: ActivatedRoute, public router: Router, private title: Title){}

  public ngOnInit(){
    this.route.params.subscribe(async (params) => {
      this.selectedYear = params["year"];
      this.title.setTitle("Hot Hundred Songs of " + this.selectMyYear);
    })
  }

  public selectMyYear(year: number){
    this.selectedYear = year;
    this.service.sendYearToChild(+this.selectedYear);
    const route = ['charts/hot-hundred-songs/' + this.selectedYear.toString()];
    this.router.navigate(route)
  }
}
