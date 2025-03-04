import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService } from '../../../app/services/general.service';
import { Meta, Title } from '@angular/platform-browser';

const STARTYEAR = 1950;
const ENDYEAR = 2023;

@Component({
  selector: 'app-hot-hundred-main',
  templateUrl: './hot-hundred-main.component.html',
  styleUrls: ['./hot-hundred-main.component.scss']
})
export class HotHundredMainComponent {
  public decades = [
    {
      startYear: 1950,
      even_years: Array.from({ length: 5 }, (_, index) => 1950 + (index * 2)),
      odd_years: Array.from({ length: 5 }, (_, index) => 1951 + (index * 2)),
    },
    {
      startYear: 1960,
      even_years: Array.from({ length: 5 }, (_, index) => 1960 + (index * 2)),
      odd_years: Array.from({ length: 5 }, (_, index) => 1961 + (index * 2)),
    },
    {
      startYear: 1970,
      even_years: Array.from({ length: 5 }, (_, index) => 1970 + (index * 2)),
      odd_years: Array.from({ length: 5 }, (_, index) => 1971 + (index * 2)),
    },
    {
      startYear: 1980,
      even_years: Array.from({ length: 5 }, (_, index) => 1980 + (index * 2)),
      odd_years: Array.from({ length: 5 }, (_, index) => 1981 + (index * 2)),
    },
    {
      startYear: 1990,
      even_years: Array.from({ length: 5 }, (_, index) => 1990 + (index * 2)),
      odd_years: Array.from({ length: 5 }, (_, index) => 1991 + (index * 2)),
    },
    {
      startYear: 2000,
      even_years: Array.from({ length: 5 }, (_, index) => 2000 + (index * 2)),
      odd_years: Array.from({ length: 5 }, (_, index) => 2001 + (index * 2)),
    },
    {
      startYear: 2010,
      even_years: Array.from({ length: 5 }, (_, index) => 2010 + (index * 2)),
      odd_years: Array.from({ length: 5 }, (_, index) => 2011 + (index * 2)),
    },
    {
      startYear: 2020,
      even_years: Array.from({ length: 2 }, (_, index) => 2020 + (index * 2)),
      odd_years: Array.from({ length: 2 }, (_, index) => 2021 + (index * 2)),
    }
  ];

  public yearsRange = Array.from({ length: ENDYEAR - STARTYEAR }, (_, index) => STARTYEAR + index)
  public selectedYear: string = "1990";
  public headline: string = `Hot 100 Songs From ${STARTYEAR} to ${ENDYEAR}`;

  public subscription: Subscription = new Subscription();

  constructor(
    public route: ActivatedRoute, 
    public router: Router, 
    public service: GeneralService, 
    private title: Title,
    private meta: Meta,
    private cd: ChangeDetectorRef
  ){}

  public ngOnInit(){
    this.subscription.add(this.service.subscribeToYearChange().subscribe((year: number) => {
      setTimeout(() => {
        this.selectedYear = year.toString();
        this.title.setTitle("Hot Hundred Songs of " + year);
        this.meta.updateTag({name: "description", content: this.title.getTitle()})
        
        this.service.refreshSidebarSongs(year);
      });
    }));

    this.subscription.add(this.service.subscribeToMainSongPageTitle().subscribe((title: string) => {
      setTimeout(() => {
        this.headline = title;
      })
    }));
  }

  public async pickTheYear(year: number){
    this.selectedYear = year.toString();
    const route = ['charts/hot-hundred-songs/' + this.selectedYear];
    await this.router.navigate(route)
    window.location.reload();
  }

  public onPickTheYear($event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.pickTheYear(+selectedValue)
  }

  public ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
