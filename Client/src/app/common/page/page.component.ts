import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPostExcerpt } from '../../../app/models/shared-models';
import { PostService } from '../../../app/services/post.service';
import { Util } from '../../common/Toolbox/util';
import { ReloadService } from '../../../app/services/reload.service';
import { Meta, Title } from '@angular/platform-browser';

const POSTPERPAGEPAGEN = 8;
const POSTPERPAGEPAGE1 = 5; 

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  public randomYear: string = "1990";
  public pageNumber: number = 1;
  public postExcerpts: IPostExcerpt[] = [];
  private postPerPage: number = 0;

  public startIndex = 0;
  public endIndex = POSTPERPAGEPAGE1;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    public postService: PostService, 
    public reloadService: ReloadService, 
    private title: Title,
    private meta: Meta
  ){}

  public async ngOnInit(){
    this.title.setTitle("Back Then Now");
    this.meta.updateTag({name: "description", content: "Website about nostalgia and celebrities"});

    this.randomYear = this.getRandomYear(1950, 2020).toString();
    this.postPerPage = (this.pageNumber === 1) ? POSTPERPAGEPAGE1 : POSTPERPAGEPAGEN;

    this.route.paramMap.subscribe(async params => {
      const pageId = +params.get('pageId');
      this.pageNumber = pageId;
      if(this.pageNumber < 1) this.pageNumber = 1;
      if(this.router.url === '/'){
        this.pageNumber = 1;
      }else{
        this.router.navigate(['/page/' + this.pageNumber])
      }

      await this.refreshPosts()
    });
  }

  public async refreshPosts(){
    this.postExcerpts = await this.postService.getAllPosts().toPromise();
    const indices = this.calculateIndices(this.pageNumber, this.postExcerpts);
    this.startIndex = indices.startIndex;
    this.endIndex = indices.endIndex; 
    //if the database has ', it escapes it with '' which somehow gets translated to (')
    this.postExcerpts.forEach(v => v.excerptDesc = v.excerptDesc.replaceAll("(')", "'"));  
  }

  private calculateIndices(pageNumber: number, postArr: IPostExcerpt[]) {
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than or equal to 1');
    }
  
    const postsPerPage = pageNumber === 1 ? POSTPERPAGEPAGE1 : POSTPERPAGEPAGEN;
    let startIndex = pageNumber === 1 ? 0 : POSTPERPAGEPAGE1 + (pageNumber - 2) * POSTPERPAGEPAGEN;
    startIndex = Math.min(startIndex, postArr.length );
    let endIndex = startIndex + postsPerPage;
    endIndex = Math.min(endIndex, postArr.length);
  
    return { startIndex, endIndex };
  }


  public getPost(postExcerpt: IPostExcerpt){
    let correctRoute = ['/posts/' + postExcerpt.postId + "/" + Util.slugify(postExcerpt.excerptTitle)];
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
