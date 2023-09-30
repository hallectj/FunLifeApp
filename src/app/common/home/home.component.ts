import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public randomYear: string = "1990";
  public pageNumber: number = 1;
  public postExcerpts: IPostExcerpt[] = [];

  constructor(public service: GeneralService, private router: Router){}

  public ngOnInit(){
    this.randomYear = this.getRandomYear(1941, 2020).toString();  
  }

  public redirectToNextPage() {
    this.router.navigate(['/page/2']); // Update the URL to "/page/2" when "Next" is clicked
  }

  //years from 1940 to 2020
  private getRandomYear(min: number, max: number): number {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }

  public getPageNumber(pageNumber: number){
    this.pageNumber = pageNumber;
  }
}
