import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { deslugify } from 'src/app/common/Toolbox/util';
import { ISong2, ISongInfoObj } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-hot-hundred-song',
  templateUrl: './hot-hundred-song.component.html',
  styleUrls: ['./hot-hundred-song.component.scss']
})
export class HotHundredSongComponent {
  public songObj: ISong2;
  public songInfoObj: {songObj: ISong2, infoObj: ISongInfoObj | null} = {
    songObj: null,
    infoObj: null
  }

  public isSongError = true;
  public youTubeURL: string = "";

  constructor(public service: GeneralService, private route: ActivatedRoute, private router: Router){}

  public ngOnInit(): void {
    // Retrieve the songObj from the state
    this.route.params.subscribe(async (params) => {
      let song = params["song"];
      let artist = params["artist"];
      let position = params["position"];

      const year = params["year"];
      artist = deslugify(artist);
      song = deslugify(song);

      this.service.sendYearToChild(year);
      this.service.updateMainSongPageTitle(" ");

      let obj: {artist: string, song: string} = {artist: "", song: ""};
      obj = await this.service.getTrueSongInfo(year, song, artist).toPromise();

      if(!!obj.artist && !!obj.song){
        this.songInfoObj = await this.service.getSongWithInfo(year, position).toPromise();
        this.youTubeURL = "https://www.youtube.com/embed/" + this.songInfoObj.songObj.videoId;
      }

      if(!!this.songInfoObj.songObj){
        this.isSongError = false;
      }
    })
  }

  public goToYear(songObj: ISong2){
    const route = ["/charts/hot-hundred-songs/" + songObj.year];
    this.router.navigate(route);
  }
}
