import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { slugify } from 'src/app/common/Toolbox/util';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-excerpt-container',
  templateUrl: './post-excerpt-container.component.html',
  styleUrls: ['./post-excerpt-container.component.scss']
})
export class PostExcerptContainerComponent {
  //TODO once backend is added, page number will determine what post the container has
  //for now fake post
  public dummyPostsExcerpts: IPostExcerpt[] = [];
  @Input() pageNumber: number = 1;
  @Input() postsPerPage: number = 0;
  public postExcerpt: IPostExcerpt;
  
  constructor(public postService: PostService, private router: Router){}
  
  public async ngOnInit(){
    this.dummyPostsExcerpts = await this.postService.getDummyPostsExcerpts().toPromise();  
  }

  get startIndex(): number {
    return (this.pageNumber - 1) * this.postsPerPage;
  }

  get endIndex(): number {
    return this.startIndex + this.postsPerPage;
  }

  public getPost(postExcerpt: IPostExcerpt){
    let correctRoute = ['/post/' + slugify(postExcerpt.excerptTitle)];
    this.router.navigate(correctRoute)
  }

}
