import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';

declare var YT: any;

@Component({
  selector: 'app-youtube-player',
  template: `
    <div #overlay id="mute-overlay" *ngIf='includeMuteOverlay'>The video is muted. Click the unmute button below</div>
    <div id="player"></div>
  `,
  styleUrls: ['./youtube-player.component.css']
})
export class YoutubePlayerComponent implements OnInit {
  @Input() videoId: string = '';
  @Input() controls: { autoplay: number, mute: number } = { autoplay: 0, mute: 1 };
  @Input() includeMuteOverlay: boolean = false;
  @ViewChild("overlay") overlay!: ElementRef<HTMLDivElement>;

  private player: any;
  private muteCheckInterval: any;

  constructor() {}

  ngOnInit(): void {
    if (this.videoId) {
      this.waitForYouTubeAPI().then(() => {
        this.loadYouTubePlayer();
      });
    }
  }

  ngOnDestroy() {
    if (this.muteCheckInterval) {
      clearInterval(this.muteCheckInterval);
    }
  }

  private waitForYouTubeAPI(): Promise<void> {
    return new Promise((resolve) => {
      if (window['YT'] && window['YT'].Player) {
        // API is already loaded
        resolve();
      } else {
        // Wait for the onYouTubeIframeAPIReady callback
        const checkInterval = setInterval(() => {
          if (window['YT'] && window['YT'].Player) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        // Fallback timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 5000);
      }
    });
  }

  public loadYouTubePlayer() {
    if (window['YT'] && window['YT'].Player) {
      this.player = new YT.Player('player', {
        videoId: this.videoId,
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: this.controls.autoplay,
          mute: this.controls.mute,
          modestbranding: 1, // Hide YouTube logo on controls
          rel: 0, // Disable related videos
        },
        events: {
          'onReady': (event: any) => this.onPlayerReady(event) // Make sure onPlayerReady is bound correctly
        }
      });
    }
  }

  private onPlayerReady(event: any) {
    // Make sure this.player is defined before setting the interval
    if (this.player && this.includeMuteOverlay && this.controls.mute === 1) {
      // Start polling for mute state changes every 500ms
      this.muteCheckInterval = setInterval(() => {
        this.checkMuteState();
      }, 500);
    }
  }

  private checkMuteState() {
    // Check if the player is unmuted
    if (this.player && !this.player.isMuted()) {
      if (this.overlay) {
        this.overlay.nativeElement.style.display = 'none'; // Hide overlay when unmuted
      }
      clearInterval(this.muteCheckInterval);
    }
  }
}

