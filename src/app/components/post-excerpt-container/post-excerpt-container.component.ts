import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  public dummyPosts: IPostExcerpt[] = [];
  @Input() pageNumber: number = 1;
  @Input() postsPerPage: number = 0;
  public postExcerpt: IPostExcerpt;
  
  constructor(public postService: PostService){}
  
  public async ngOnInit(){
    this.dummyPosts = await this.postService.getDummyPosts().toPromise();  
  }

  get startIndex(): number {
    return (this.pageNumber - 1) * this.postsPerPage;
  }

  get endIndex(): number {
    return this.startIndex + this.postsPerPage;
  }

  public getPost(post: IPostExcerpt){
    this.postExcerpt = post;
    this.postService.notifyPostBlogComponentOfPost(post);    
  }
}
