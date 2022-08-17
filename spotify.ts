// Name: spotify-playing
// Description: Show currently playing spotify track
// Author: Jacopo De Gattis

import "@johnlindquist/kit"
import { WidgetAPI } from "@johnlindquist/kit/types/pro";

const spotify = await npm("spotify-node-applescript")

const playing = false;
const state: Playback = {
    name: "",
    artist: "",
    artwork_url: ""
}

interface Playback {
    name: string,
    artist: string
    artwork_url: string,
}

const wgt: WidgetAPI = await widget(`
	<div class="px-1 flex flex-row w-full justify-between">
        <div class="cover-img" v-bind:style="{'backgroundImage': state.artwork_url ? 'url(' + state.artwork_url + ')' : 'url(' + fallback_icon + ')' }"></div>
        <div class="flex flex-row justify-start track-infos left-container">
            <div class="flex flex-col ml-4 justify-center">
                <pre class="font-inter">{{state.name ? state.name : "No music playing"}}</pre>
                <pre class="text-xs">{{state.artist && state.artist}}</pre>
            </div>
        </div>
        <div class="flex justify-center items-center btn-container">
            <button v-if="state.name" id="play-pause" class="play-pause-btn flex justify-center items-center">
                <img id="play-pause-img" v-bind:src="playing ? pause_icon : play_icon" />
            </button>
        </div>
	</div>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;700&display=swap');

        * {
            user-select: none;
        }

        .cover-img {
            width: 75px;
            height: 75px;
            border-radius: 10px;
            box-shadow: 7px 7px 5px black;
            background-size: 100%;
            transition: background-image 1s ease-in;
        }

        .left-container {
            width: 200px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            margin-right: 20px;
        }

		.track-infos img {
			border-radius: 10px;
			box-shadow: 7px 7px 5px black;
		}
		
		pre:first-child {
			font-family: 'Inter';
			font-weight: bold;
			font-size: 100%;
		}

		pre:last-child {
			font-family: 'Inter';
			font-weight: light;
			font-size: 3.0vw;
		}

		svg {
			margin-top: 20px;
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
            box-shadow: 7px 7px 5px black;
        }

        .play-pause-btn:hover {
            transform: scale(1.05);
        }

	</style>
`, {
    state: {
        pause_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAHRJREFUSEtjZKAxYKSx+QwDasFzBgYGCSQfZjAwMMyE8kHs6UhyLxgYGCSxhQY+H/xH09DIwMDQABUD0fVo8ljNGrUAOZRGg4hhNBVh5MPRjAYOktGiYnAXFfgqnHQGBoYZSM4HqZUitcKhSnU9oHUyVXwAAOhlOBlZoVRaAAAAAElFTkSuQmCC",
        play_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAMlJREFUSEvV1UFqAkEQRuHP0+kRvIR7CYiucgUXEcG48hSCRxA8ggQXbgK6SUAZ6AZFcRzHQux9v0dVV//VEHwawXwvEbQwwQif2NWp8loFA/QTdI0PfD8qKRNk7hwdrKqK7hUU3D8M0cPvvaIqgsz8QRdTHMpEjwgyc5HatrwlqSMouP8Yp0HYXhPVFWTmJrWtGO+ztj1LkEVtzE4reRtBWItCHzlsTMM+WmhUhIVdSFw3U/5/pYWzLwu0qllUh3dx9yU7+akVHAG+vzwZybfc1AAAAABJRU5ErkJggg==",
        fallback_icon: "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"
    }
})

wgt.onClick((event: any) => {
    if (["play-pause", "play-pause-img"].includes(event.targetId)) {
        spotify.playPause((a) => {
            log({a: a})
            wgt.setState({ playing: !playing })
        });
    }
})

const loop = () => {
	wgt.setSize(400, 85)

    setInterval(async () => {
        spotify.getTrack((err: any, track: any) => {
            if (err) return
            
            log({info: track})

            spotify.getState((err, state) => {
                if (err) return

                wgt.setState({
                    state: track,
                    playing: state.state === "playing" ? true : false
                })
            })
        })
    }, 1000)
}

wgt.onResized(() => wgt.setSize(400, 85))

loop()