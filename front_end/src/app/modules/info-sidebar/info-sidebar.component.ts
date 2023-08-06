import { Component, Input } from '@angular/core';
import { HomeService } from 'src/app/common/home/home.service';

@Component({
  selector: 'info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.scss']
})

export class InfoSidebarComponent {
  public youtubeURL: string = "https://www.youtube.com/watch?v=3KFvoDDs0XM";
  public thumbnail: string = "";
  public youtubeApi: ReturnType<InfoSidebarComponent['youtube']> | undefined;
  
  @Input() randomYear: string = "1990";
  
  constructor(public homeService: HomeService){}

  public youtube = () => {
    let video: string = "", results: RegExpMatchArray | null;
  
    const youtubeObj = {
      thumbnail: (url: string) => {
        if (url === null) { return ""; }
        results = url.match('[\\?&]v=([^&#]*)');
        video = (results == null) ? url : results[1];
        return `http://img.youtube.com/vi/${video}/2.jpg`;
      },
    };
  
    return youtubeObj;
  };

  ngOnInit(){
    this.youtubeApi = this.youtube();
    this.thumbnail = this.youtubeApi.thumbnail(this.youtubeURL);
  }
}
