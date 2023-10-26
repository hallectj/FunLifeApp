import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { slugify } from 'src/app/common/Toolbox/util';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-excerpt',
  templateUrl: './post-excerpt.component.html',
  styleUrls: ['./post-excerpt.component.scss']
})
export class PostExcerptComponent {
  @Input() postExcerpt: IPostExcerpt;
  @Input() useRibbonYear: boolean = false;
  @Input() year: number = 0;
  @Input() useRow: boolean = true;
  @Output() postExcerptEvent: EventEmitter<IPostExcerpt> = new EventEmitter<IPostExcerpt>();

  constructor(public service: PostService, public router: Router ){}

  public getPost(post: IPostExcerpt){
    let correctRoute = ['/post/' + slugify(this.postExcerpt.excerptTitle)];
    this.router.navigate(correctRoute)
  }
}
