import { Component } from '@angular/core';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'missed-article-widget',
  templateUrl: './missed-article-widget.component.html',
  styleUrls: ['./missed-article-widget.component.scss']
})
export class MissedArticleWidgetComponent {
  public inCaseYouMissedArr: IPostExcerpt[] = [];
  constructor(public postService: PostService){}

  public async ngOnInit(){
    await this.populateInCaseYouMissed();
    console.log("inCasedYouMissedArr", this.inCaseYouMissedArr)
  }

  public async populateInCaseYouMissed(){
    let posts = await this.postService.getDummyPosts().toPromise();
    const randLen = (posts.length >= 3) ? 3 : posts.length;
    this.inCaseYouMissedArr = [];

    for (let i = 0; i < randLen; i++) {
      let idx = Math.floor(Math.random() * posts.length);
      this.inCaseYouMissedArr.push(posts[idx]);
      posts.splice(idx, 1);
    }    
  }
}
