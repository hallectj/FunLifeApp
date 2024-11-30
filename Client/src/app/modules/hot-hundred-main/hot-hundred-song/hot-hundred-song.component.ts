import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { deslugify, slugify } from '../../../../app/common/Toolbox/util';
import { ISong2, ISongInfoObj } from '../../../../app/models/shared-models';
import { GeneralService } from '../../../../app/services/general.service';
import { Meta, Title } from '@angular/platform-browser';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';

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

  constructor(
    public service: GeneralService, 
    public breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute, 
    private router: Router, 
    private title: Title,
    private meta: Meta
  ){}

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

      this.title.setTitle(song + " by " + artist + " " + year);
      this.meta.updateTag({name: "description", content: this.title.getTitle()});

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
    const breadcrumb: {valid_urls: string, long_urls: string}[] = [];
    const longURL = `/ > charts/hot-hundred-songs > charts/hot-hundred-songs/${this.currentYear} > charts/hot-hundred-songs/${this.currentYear}/${position}/artist/${slugify(this.songInfoObj.songObj.artist)}/song/${slugify(this.songInfoObj.songObj.song)}`;
    const validURL = `Home > charts/hot-hundred-songs > ${this.currentYear} > ${this.currentYear}/${position}/artist/${slugify(this.songInfoObj.songObj.artist)}/song/${slugify(this.songInfoObj.songObj.song)}"`;
    
    //since this is the tail, only one element in array is all that is needed.
    breadcrumb[0] = {valid_urls: validURL, long_urls: longURL};
    this.breadcrumbService.setBreadcrumb(breadcrumb)
    this.loading = false;
    this.youTubeURL = "https://www.youtube.com/embed/" + this.songInfoObj.songObj.videoId;
  }

  public onPositionSelect(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectPosition(+selectedValue);
  }

  public extractArtists(inputString: string): string[] {
    const featuringIndex = inputString.toLowerCase().indexOf("featuring");
    const commaIndex = inputString.toLowerCase().indexOf(",");
  
    if (featuringIndex !== -1) {
      // "featuring" is present in the string
      const artistsString = inputString.substring(0, featuringIndex).trim();
      const featuringPart = inputString.substring(featuringIndex + "featuring".length).trim();
  
      const artistsArray = [...artistsString.split(/\band\b/i), ...featuringPart.split(/\band\b/i)].map(artist => artist.trim());
      return artistsArray;
    } else if (commaIndex !== -1) {
      const artistArr = inputString.split(",");
      return artistArr;
    } else {
      // "featuring" is not present in the string
      return [inputString.trim()];
    }
  }
  

  public goToYear(songObj: ISong2){
    const route = ["/charts/hot-hundred-songs/" + songObj.year];
    this.router.navigate(route);
  }

  public onClickArtist(songObj: ISong2){
    const correctedArtist = this.extractArtists(songObj.artist);
    const route = ["/charts/hot-hundred-songs/artist/" + slugify(correctedArtist[0])];
    this.router.navigate(route);
  }

  public getLimit(year: number): number {
    switch (true) {
      case (year >= 1950 && year <= 1955):
          return 30;
      case (year >= 1956 && year <= 1959):
          return 50;
      case (year >= 1960 && year <= 2023):
          return 100;
      default:
          return -1;
    }
  }
}
