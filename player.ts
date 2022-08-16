// Name: spotify-playing
// Description: Show currently playing spotify track
// Author: Jacopo De Gattis

import "@johnlindquist/kit"
import { WidgetAPI } from "@johnlindquist/kit/types/pro";

const spotify = await npm("spotify-node-applescript")
const COMMAND: string = "osascript /Users/liljack/.kenv/scripts/spot.applescript";

const state: Playback = {
	name: "",
	artist: "",
	artwork_url: "",
}

interface Playback {
	name: string,
	artist: string
	artwork_url: string,
}

const readData: string = `
	global artistName, songName, currentCoverURL

	tell application "Spotify"
		set currentCoverURL to artwork url of current track
		set {songId, artistName, songName, albumName, songDuration} to {id, artist, name, album, duration} of current track
		set output to artistName & " @ " & songName & " @ " & currentCoverURL
	end tell
`

const wgt: WidgetAPI = await widget(`
	<div class="px-1 flex flex-row justify-start w-full">
		<img
			width="75"
			v-bind:src="state.artwork_url || 'https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999'"
		/>
		<div class="flex flex-col ml-4 justify-center">
			<pre class="font-inter">{{state.name || "No music playing"}}</pre>
			<pre class="text-xs">{{state.artist && state.artist}}</pre>
		</div>
	</div>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;700&display=swap');
		
		img {
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
	</style>
`, {})

const loop = () => {
	wgt.setSize(400, 85)

	setInterval(async () => {
		spotify.getTrack((err: any, track: any) => {
			if (err) return
			wgt.setState({ state: track })
		})
	}, 1000)
}

wgt.onResized(() => wgt.setSize(400, 85))

loop()