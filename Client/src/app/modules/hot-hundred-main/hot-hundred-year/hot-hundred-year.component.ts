import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { slugify } from '../../../../app/common/Toolbox/util';
import { ISong2 } from '../../../../app/models/shared-models';
import { GeneralService } from '../../../../app/services/general.service';
import { Meta, Title } from '@angular/platform-browser';

const HOT_HUNDRED_SONGS_KEY = makeStateKey<ISong2[]>('hotHundredSongs');

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
    private meta: Meta,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.selectedYear = params["year"];
      this.service.sendYearToChild(+this.selectedYear);
      this.title.setTitle("Hot Hundred Songs of " + this.selectedYear);
      this.meta.updateTag({ name: "description", content: "Hot Hundred Songs of " + this.selectedYear });

      if (this.state.hasKey(HOT_HUNDRED_SONGS_KEY)) {
        this.hotHundredSongs = this.state.get(HOT_HUNDRED_SONGS_KEY, []);
      } else {
        this.hotHundredSongs = await this.service.getSongs(+this.selectedYear, "position").toPromise();
        this.hotHundredSongs.sort((a, b) => a.position - b.position);
        if (isPlatformServer(this.platformId)) {
          this.state.set(HOT_HUNDRED_SONGS_KEY, this.hotHundredSongs);
        }
      }

      this.service.updateMainSongPageTitle("Top " + this.hotHundredSongs.length + " Songs of " + this.selectedYear);
    });
  }

  public onClickedSong(songObj: ISong2) {
    const route = ['charts/hot-hundred-songs/' + this.selectedYear + "/" + songObj.position + "/artist/" + slugify(songObj.artist) + "/song/" + slugify(songObj.song)];
    this.router.navigate(route);
  }

  public async onClickedArtist(songObj: ISong2, artist: string) {
    const route = ['charts/hot-hundred-songs/artist/' + slugify(artist)];
    this.router.navigate(route);
  }

  public extractArtists(inputString: string): string[] {
    const featuringIndex = inputString.toLowerCase().indexOf("featuring");
    const commaIndex = inputString.toLowerCase().indexOf(",");

    if (featuringIndex !== -1) {
      const artistsString = inputString.substring(0, featuringIndex).trim();
      const featuringPart = inputString.substring(featuringIndex + "featuring".length).trim();
      const artistsArray = [...artistsString.split(/\band\b/i), ...featuringPart.split(/\band\b/i)].map(artist => artist.trim());
      return artistsArray;
    } else if (commaIndex !== -1) {
      const artistArr = inputString.split(",");
      return artistArr;
    } else {
      return [inputString.trim()];
    }
  }
}