import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiLoaded = false;

  constructor() {
    this.loadYouTubeAPI();
  }

  private loadYouTubeAPI(): void {
    if (!this.apiLoaded) {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      this.apiLoaded = true;
    }
  }

  public onYouTubeIframeAPIReady(callback: () => void): void {
    if ((window as any).YT && (window as any).YT.Player) {
      callback();
    } else {
      (window as any).onYouTubeIframeAPIReady = callback;
    }
  }
}