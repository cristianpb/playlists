---
toc: false
footer: ""
theme: [sun-faded]
---

# New songs

Recent songs from the last month.

```js
import {mostFrequent, parseDate, BestSongsPlot, BestArtistsPlot, RecentSongAdds, RecentSongsPlot} from "./components/tools.js";
const latestArtists = await FileAttachment("data/latestArtists.csv").csv({typed: true})
const diffData = await FileAttachment("data/playlistdiff.csv").csv({typed: true})
const predictions = await FileAttachment("data/bestArtists.csv").csv({typed: true})

```

<div class="grid grid-cols-1" style="grid-auto-rows: 560px;">
  <div class="card">
    ${RecentSongsPlot(latestArtists)}
  </div>
</div>

# Playlist details

From ${Array.from(new Set(diffData.map(i => parseDate(i.commit_date))))[1]} to ${Array.from(new Set(diffData.map(i => parseDate(i.commit_date))))[0]} new songs have been added to the playlist.


```js
const playlistsNames = predictions.map(i => i.playlist)
const playlistChoosen = view(Inputs.select(new Set(playlistsNames), {value: playlistsNames[0], label: "Playlists"}));
const artistsNames = predictions.map(i => i.artists)
```


```js
const tableRows = RecentSongAdds(diffData, playlistChoosen)
```


<div class="card" style="margin: 1rem 0 2rem 0; padding: 0;">
  ${Inputs.table(tableRows.filter(i => i.attribute == "+"), {
  columns: ["position", "artists", "name", "album_name", "attribute"],
  align: {"position": "left"},
  format: {
    attribute: (x) => x == "+" ? "New!" : x == "-" ? "🗑" : x > 0 ? `⬆${x}` : x == 0 ? '--' : `⬇${Math.abs(x)}`
  }
})}
</div>


<div class="grid grid-cols-1" style="grid-auto-rows: 560px;">
  <div class="card">
    ${BestArtistsPlot(predictions.filter(row => (row.playlist == playlistChoosen) & (predictions.filter(i => i.playlist == playlistChoosen).map(i => i.artists).slice(0,10).includes(row.artists))), playlistChoosen)}
  </div>
</div>

```js
const mostPopularArtists = view(Inputs.select(mostFrequent(predictions.filter(i => i.playlist == playlistChoosen).map(i => i.artists)).slice(0,10), {value: artistsNames[0], label: "Popular artists"}));
```

<div class="grid grid-cols-1" style="grid-auto-rows: 560px;">
  <div class="card">
    ${BestSongsPlot(predictions.filter(row => (row.playlist == playlistChoosen) & (mostPopularArtists.includes(row.artists))), playlistChoosen, mostPopularArtists)}
  </div>
</div>


<div class="card" style="margin: 1rem 0 2rem 0; padding: 0;">
  ${Inputs.table(predictions
  .filter((row, index) => predictions.map(i =>  `${i.song_id}${i.artists}`).indexOf(`${row.song_id}${row.artists}`) === index)
  .filter((row, index) => (row.playlist == playlistChoosen) & (mostPopularArtists.includes(row.artists)))
  , {
  columns: ["artists", "name", "album_name", "date"],
  })}
</div>
