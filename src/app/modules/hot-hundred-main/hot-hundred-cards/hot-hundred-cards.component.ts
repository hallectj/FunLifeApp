import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-hot-hundred-cards',
  templateUrl: './hot-hundred-cards.component.html',
  styleUrls: ['./hot-hundred-cards.component.scss']
})
export class HotHundredCardsComponent {
  public yearsRange = Array.from({ length: 71 }, (_, index) => 1950 + index);
  public selectedYear: number = 1990;

  constructor(public service: GeneralService, public route: ActivatedRoute, public router: Router){}

  public ngOnInit(){
    this.route.params.subscribe(async (params) => {
      this.selectedYear = params["year"];
    })
  }

  public selectMyYear(year: number){
    this.selectedYear = year;
    this.service.sendYearToChild(+this.selectedYear);
    const route = ['charts/hot-hundred-songs/' + this.selectedYear.toString()];
    this.router.navigate(route)
  }
}
