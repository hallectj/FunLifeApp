import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Util } from '../../../common/Toolbox/util';
import { ISong2 } from '../../../../app/models/shared-models';
import { GeneralService } from '../../../../app/services/general.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hot-hundred-year',
  templateUrl: './hot-hundred-year.component.html',
  styleUrls: ['./hot-hundred-year.component.scss']
})
export class HotHundredYearComponent {
  public selectedYear: string = "1990";
  public hotHundredSongs: ISong2[] = [];


  constructor(
    public service: GeneralService, 
    public route: ActivatedRoute, 
    public router: Router, 
    private title: Title,
    private meta: Meta
  ){}

  public async ngOnInit(){
    this.route.params.subscribe(async (params) => {
      this.selectedYear = params["year"];
      this.service.sendYearToChild(+this.selectedYear)
      this.title.setTitle("Hot Hundred Songs of " + this.selectedYear);
      this.meta.updateTag({name: "description", content: "Hot Hundred Songs of " + this.selectedYear});
      this.hotHundredSongs = await this.service.getSongs(+this.selectedYear, "position").toPromise();
      this.service.updateMainSongPageTitle("Top " + this.hotHundredSongs.length + " Songs of " + this.selectedYear);
    });
  }

  public onClickedSong(songObj: ISong2){
    const route = ['charts/hot-hundred-songs/' + this.selectedYear + "/" + songObj.position + "/artist/" + Util.slugify(songObj.artist) + "/song/" + Util.slugify(songObj.song)];
    this.router.navigate(route);
  }

  public async onClickedArtist(songObj: ISong2, artist: string){
    //artist name isn't always accurate after desluggifying, so make another call to get artist
    //const response = await this.service.getSongObj(+this.selectedYear, songObj.position).toPromise();
    //const artist = (!!response && !!response.artist) ? response.artist : songObj.artist;
    const route = ['charts/hot-hundred-songs/artist/' + Util.slugify(artist)];
    this.router.navigate(route);
  }

  public extractArtists(inputString: string): string[] {
    const featuringIndex = inputString.toLowerCase().indexOf("featuring");
  
    if (featuringIndex !== -1) {
      // "featuring" is present in the string
      const artistsString = inputString.substring(0, featuringIndex).trim();
      const featuringPart = inputString.substring(featuringIndex + "featuring".length).trim();
  
      const artistsArray = [...artistsString.split(/\band\b/i), ...featuringPart.split(/\band\b/i)].map(artist => artist.trim());
      return artistsArray;
    } else {
      // "featuring" is not present in the string
      return [inputString.trim()];
    }
  }
}
