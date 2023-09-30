import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPostExcerpt } from 'src/app/models/shared-models';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  public randomYear: string = "1990";
  public pageNumber: number = 1;
  public postExcerpts: IPostExcerpt[] = [];

  constructor(private route: ActivatedRoute, private router: Router){}

  ngOnInit(){
    this.randomYear = this.getRandomYear(1941, 2020).toString();  
    this.route.paramMap.subscribe(params => {
      const pageId = +params.get('pageId');
      this.pageNumber = pageId;
      if(this.pageNumber < 1) this.pageNumber = 1;
      if(this.router.url === '/'){
        this.pageNumber = 1;
      }else{
        this.router.navigate(['/page/' + this.pageNumber])
      }      
    });
  }

  public getPageNumber(pageNumber: number){
    this.pageNumber = pageNumber;
    if(this.router.url === '/' && this.pageNumber === 1){
      this.pageNumber = 2;
      this.router.navigate(['/page/' + this.pageNumber])
    }
  }

  //years from 1940 to 2020
  private getRandomYear(min: number, max: number): number {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }
}
