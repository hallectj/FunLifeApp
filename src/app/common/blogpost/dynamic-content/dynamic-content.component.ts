import { Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicContentComponent {
  public exampleHTML = "";
  public contentIsLoading: boolean = false;

  @ViewChild('postContent', { static: true }) postContent: ElementRef;

  constructor(private renderer: Renderer2, public service: PostService){}

  public async ngOnInit(){
    this.contentIsLoading = true;
    this.exampleHTML = await this.service.getPost().toPromise();
    //this.renderer.setProperty(this.postContent.nativeElement, 'innerHTML', this.exampleHTML);
    this.contentIsLoading = false;
  }
}
