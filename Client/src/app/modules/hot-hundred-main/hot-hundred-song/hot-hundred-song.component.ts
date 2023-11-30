import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { deslugify, slugify } from '../../../../app/common/Toolbox/util';
import { ISong2, ISongInfoObj } from '../../../../app/models/shared-models';
import { GeneralService } from '../../../../app/services/general.service';


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
  public ranks = [];
  public currentRank = -1;
  public currentYear = 1990;

  public loading: boolean = true;

  constructor(public service: GeneralService, private route: ActivatedRoute, private router: Router){}

  public ngOnInit(): void {
    // Retrieve the songObj from the state
    this.route.params.subscribe(async (params) => {
      this.loading = true;

      const song = deslugify(params["song"]);
      const artist = deslugify(params["artist"]);
      const position = params["position"];
      const year = params["year"];     
      this.currentRank = +position;
      this.currentYear = +year;

      this.ranks = [...Array(this.getLimit(year)).keys()].map(num => num + 1);

      this.service.sendYearToChild(year);
      this.service.updateMainSongPageTitle(" ");

      let obj: {artist: string, song: string} = {artist: "", song: ""};
      obj = await this.service.getTrueSongInfo(year, song, artist).toPromise();

      if(!!obj.artist && !!obj.song){
        this.songInfoObj = await this.service.getSongWithInfo(year, position).toPromise();
        this.youTubeURL = "https://www.youtube.com/embed/" + this.songInfoObj.songObj.videoId;
      }

      this.loading = false;

      if(!!this.songInfoObj.songObj){
        this.isSongError = false;
      }
    })
  }

  public async selectPosition(position: number){
    this.loading = true;
    this.currentRank = position;
    this.songInfoObj = await this.service.getSongWithInfo(this.currentYear, this.currentRank).toPromise();
    this.loading = false;
    this.youTubeURL = "https://www.youtube.com/embed/" + this.songInfoObj.songObj.videoId;
  }

  public goToYear(songObj: ISong2){
    const route = ["/charts/hot-hundred-songs/" + songObj.year];
    this.router.navigate(route);
  }

  public onClickArtist(songObj: ISong2){
    const route = ["/charts/hot-hundred-songs/artist/" + slugify(songObj.artist)];
    this.router.navigate(route);
  }

  public getLimit(year: number): number {
    switch (true) {
      case (year >= 1950 && year <= 1955):
          return 30;
      case (year >= 1956 && year <= 1959):
          return 50;
      case (year >= 1960 && year <= 2021):
          return 100;
      default:
          return -1;
    }
  }
}
