import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';
import { isValidDate, slugify } from '../Toolbox/util';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  public randomYear: string = "1990";
  public pageNumber: number = 1;
  public postExcerpts: IPostExcerpt[] = [];

  constructor(private route: ActivatedRoute, private router: Router, public postService: PostService){}

  public async ngOnInit(){
    this.randomYear = this.getRandomYear(1950, 2020).toString();   
    this.route.paramMap.subscribe(async params => {
      const pageId = +params.get('pageId');
      this.pageNumber = pageId;
      if(this.pageNumber < 1) this.pageNumber = 1;
      if(this.router.url === '/'){
        this.pageNumber = 1;
      }else{
        this.router.navigate(['/page/' + this.pageNumber])
      }
      this.postExcerpts = await this.postService.getAllPosts().toPromise();      
    });
  }

  get startIndex(): number {
    const postsPerPage = this.pageNumber === 1 ? 5 : 8;
    return (this.pageNumber - 1) * postsPerPage;
  }

  get endIndex(): number {
    const postsPerPage = this.pageNumber === 1 ? 5 : 8;
    return this.startIndex + postsPerPage;
  }

  public getPost(postExcerpt: IPostExcerpt){
    let correctRoute = ['/posts/' + postExcerpt.postId + "/" + slugify(postExcerpt.excerptTitle)];
    this.router.navigate(correctRoute)
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
