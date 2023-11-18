import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISong2 } from 'src/app/models/shared-models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-hot-hundred-artist',
  templateUrl: './hot-hundred-artist.component.html',
  styleUrls: ['./hot-hundred-artist.component.scss']
})
export class HotHundredArtistComponent {
  constructor(public service: GeneralService, public route: ActivatedRoute, public router: Router){}

  public artist: string = "";
  public songs: ISong2[] = [];

  public async ngOnInit(){
    this.route.params.subscribe(async (params) => {
      const artist = params["artist"] as string;
      const featuringStr = this.findFeaturingKeyword(artist);
      this.artist = (!!featuringStr) ? artist.split(featuringStr)[0] : artist;
      this.service.updateMainSongPageTitle(" ");
      this.songs = await this.service.getSongsByArtist(this.artist, true).toPromise();
    })
  }

  private findFeaturingKeyword(inputString) {
    const regex = /\bfeaturing\b/i;
    const match = inputString.match(regex);
    return match ? match[0] : "";
  }

  public onClickedSongCard(song: ISong2){
    const route = ["/charts/hot-hundred-songs/" + song.year + "/" + song.position + "/artist/" + song.artist + "/song/" + song.song];
    this.router.navigate(route);
  }
}
