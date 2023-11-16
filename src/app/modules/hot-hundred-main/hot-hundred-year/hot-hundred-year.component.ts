import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { slugify } from 'src/app/common/Toolbox/util';
import { ISong2 } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-hot-hundred-year',
  templateUrl: './hot-hundred-year.component.html',
  styleUrls: ['./hot-hundred-year.component.scss']
})
export class HotHundredYearComponent {
  public selectedYear: string = "1990";
  public hotHundredSongs: ISong2[] = [];


  constructor(public service: GeneralService, public route: ActivatedRoute, public router: Router){}

  public async ngOnInit(){
    this.route.params.subscribe(async (params) => {
      this.selectedYear = params["year"];
      this.service.sendYearToChild(+this.selectedYear)
      this.hotHundredSongs = await this.service.getSongs(+this.selectedYear, "position").toPromise();
      this.service.updateMainSongPageTitle("Top " + this.hotHundredSongs.length + " Songs of " + this.selectedYear);
    });
  }

  public onClickedSong(songObj: ISong2){
    const route = ['charts/hot-hundred-songs/' + this.selectedYear + "/" + songObj.position + "/artist/" + slugify(songObj.artist) + "/song/" + slugify(songObj.song)];
    this.router.navigate(route);
  }
}
