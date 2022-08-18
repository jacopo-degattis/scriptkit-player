// Name: spotify-playing-github
// Description: Show currently playing spotify track
// Author: Jacopo De Gattis

import "@johnlindquist/kit"
import { WidgetAPI } from "@johnlindquist/kit/types/pro";

const spotify = await npm("spotify-node-applescript")

interface Track {
    artist: string,
    album: string,
    disc_number: number,
    duration: number,
    played_count: number,
    track_number: number,
    starred: boolean,
    popularity: number,
    id: string,
    name: string,
    album_artist: string,
    artwork_url: string,
    spotify_url: string
}

interface SpotifyState {
    volume: number,
    position: number,
    state: "playing" | "paused"
}

interface Playback {
    name: string,
    artist: string,
    artwork_url: string,
}

interface Config {
    progressBar: boolean,
    playPauseBtn: boolean,
}

const playing: boolean = false;
const state: Playback = {
    name: "",
    artist: "",
    artwork_url: ""
}

const config: Config = {
    progressBar: true,
    playPauseBtn: true,
}

const wgt: WidgetAPI = await widget(`
    <div class="px-1 flex flex-row w-full justify-between">
        <div
            class="cover-img"
            v-bind:style="{'backgroundImage': state.artwork_url ? 'url(' + state.artwork_url + ')' : 'url(' + fallback_icon + ')' }"
        ></div>
        <div class="flex flex-row justify-start left-container">
            <div class="flex flex-col ml-4 justify-center w-full details-wrapper">
                <pre class="track-name">{{state.name ? state.name : "No music playing"}}</pre>
                <pre class="artist-name text-xs">{{state.artist && state.artist}}</pre>
                <div v-if="state.name && config.progressBar" class="progress-bar">
                    <div class="progress-bar-inner" v-bind:style="{'width': percentage + '%'}"></div>
                </div>
                <div v-if="state.name && config.progressBar" class="duration-container flex flex-row justify-between">
                    <small class="duration-label">{{position}}</small>
                    <small class="duration-label">{{trackDuration}}</small>
                </div>
            </div>
        </div>
        <div v-if="config.playPauseBtn" class="flex justify-center items-center btn-container">
            <button v-if="state.name" id="play-pause" class="play-pause-btn flex justify-center items-center">
                <img id="play-pause-img" v-bind:src="playing ? pause_icon : play_icon" />
            </button>
        </div>
    </div>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;700&display=swap');

        * {
            user-select: none;
            font-family: 'Inter';
        }

        .progress-bar {
            margin: 2px 0;
            background-color: #f5f5f522;
            height: 2.5px;
            border-radius: 2px;
            width: 100%;
            overflow: hidden;
        }
        
        .duration-container{
            width: 100%;
        }

        .progress-bar-inner {
            background-color: #f5f5f5;
            border-radius: 2px;
            height: 100%;
        }

        .cover-img {
            width: 75px;
            height: 75px;
            border-radius: 10px;
            box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.4);
            background-size: 100%;
            transition: background-image 1s ease-in;
        }

        .details-wrapper {
            max-width: 100%;
            overflow: hidden;
        }

        .left-container {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            margin-right: 20px;
            flex: 1;
        }
        
        .track-name {
            font-family: 'Inter';
            font-weight: bold;
            font-size: 100%;
        }

        .artist-name {
            font-family: 'Inter';
            font-weight: light;
            font-size: 3.0vw;
        }

        .duration-label {
            font-size: 2.0vw;
            color: #f5f5f5aa;
        }

        .btn-container {
            margin-right: 20px;
        }

        .play-pause-btn {
            padding: 5px;
            background-color: #1ED760;
            border-radius: 70%;
            height: 50px;
            width: 50px;
            transition-duration: 0.3s;
            box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.4);
        }

        .play-pause-btn:hover {
            transform: scale(1.05);
        }

    </style>
`, {
    state: {
        config: config,
        pause_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAHRJREFUSEtjZKAxYKSx+QwDasFzBgYGCSQfZjAwMMyE8kHs6UhyLxgYGCSxhQY+H/xH09DIwMDQABUD0fVo8ljNGrUAOZRGg4hhNBVh5MPRjAYOktGiYnAXFfgqnHQGBoYZSM4HqZUitcKhSnU9oHUyVXwAAOhlOBlZoVRaAAAAAElFTkSuQmCC",
        play_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAMlJREFUSEvV1UFqAkEQRuHP0+kRvIR7CYiucgUXEcG48hSCRxA8ggQXbgK6SUAZ6AZFcRzHQux9v0dVV//VEHwawXwvEbQwwQif2NWp8loFA/QTdI0PfD8qKRNk7hwdrKqK7hUU3D8M0cPvvaIqgsz8QRdTHMpEjwgyc5HatrwlqSMouP8Yp0HYXhPVFWTmJrWtGO+ztj1LkEVtzE4reRtBWItCHzlsTMM+WmhUhIVdSFw3U/5/pYWzLwu0qllUh3dx9yU7+akVHAG+vzwZybfc1AAAAABJRU5ErkJggg==",
        fallback_icon: "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999",
    }
})

wgt.onClick((event: any) => {
    if (["play-pause", "play-pause-img"].includes(event.targetId)) {
        spotify.playPause(() => {
            wgt.setState({ playing: !playing })
        });
    }
})

const loop = () => {
    wgt.setSize(400, 85)

    setInterval(() => {
        spotify.isRunning((err: any, isRunning: boolean) => {
            if (!isRunning) return

            spotify.getTrack((err: any, track: Track) => {
                if (err) return

                spotify.getState((err: any, state: SpotifyState) => {
                    if (err) return

                    const { position } = state;
                    const trackLenght = Math.floor(track?.duration / 1000);

                    wgt.setState({
                        state: track,
                        playing: state.state === "playing",
                        percentage: trackLenght && (position / trackLenght) * 100,
                        position: formatDuration(position),
                        trackDuration: formatDuration(trackLenght),
                    })
                })
            })
        })
    }, 1000)
}

const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60)
    const seconds = duration - (minutes * 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}


wgt.onResized(() => wgt.setSize(400, 85))

loop()