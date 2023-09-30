import { Component, Input } from '@angular/core';
import { ISong } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.scss']
})

export class InfoSidebarComponent {
  //ALL songs
  public songs: ISong[] = [];

  //Songs filtered by year and longest number one song
  public songsByYearArr: ISong[] = [];

  @Input() randomYear: string = "1990";
  
  constructor(public generalService: GeneralService){}

  public async ngOnInit(){
    const response: ISong[] | undefined = await this.generalService.getSongs().toPromise();
    this.songs = response as ISong[];
    this.songsByYearArr = this.generalService.findLongestNumberOneSongs(this.songs, +this.randomYear, 10);

  }
}
