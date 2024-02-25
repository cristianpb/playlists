---
toc: false
footer: ""
theme: [sun-faded]
---

# New songs

Recent songs from the last month.

```js
import {mostFrequent, parseDate, BestSongsPlot, BestArtistsPlot, RecentSongAdds, RecentSongsPlot} from "./components/tools.js";
const latestSongs = await FileAttachment("data/latestArtists.csv").csv({typed: true})
const diffData = await FileAttachment("data/playlistdiff.csv").csv().then(data => {
      return data.map(row => {
        row.commit_date = parseDate(new Date(row.commit_date))
        return row
      });
    });
const bestArtists = await FileAttachment("data/bestArtists.csv").csv().then(data => {
      return data.map(row => {
        row.commit_date_str = row.commit_date;
        row.commit_date = new Date(row.commit_date);
        row.name = row.name.toLowerCase();
        row.position = +row.position;
        return row
      });
    });
```

<div class="grid grid-cols-1" style="grid-auto-rows: 560px;">
  <div class="card">
    ${RecentSongsPlot(latestSongs)}
  </div>
</div>

# Playlist details

```js
const commit_date_old = Array.from(new Set(diffData.map(i => i.commit_date)))[1];
const commit_date_recent = Array.from(new Set(diffData.map(i => i.commit_date)))[0];
```


From ${commit_date_old} to ${commit_date_recent} new songs have been added to the playlist.


```js
const playlistsNames = bestArtists.map(i => i.playlist)
const playlistChoosen = view(Inputs.select(new Set(playlistsNames), {value: playlistsNames[0], label: "Playlists"}));
const artistsNames = bestArtists.map(i => i.artists)
```


```js
const tableRows = RecentSongAdds(diffData, playlistChoosen, commit_date_old, commit_date_recent)
```


<div class="card" style="margin: 1rem 0 2rem 0; padding: 0;">
  ${Inputs.table(tableRows, {
  columns: ["position", "artists", "name", "album_name", "attribute"],
  align: {"position": "left"},
  format: {
    attribute: (x) => x == "+" ? "New!" : x == "-" ? "🗑" : x > 0 ? `⬆${x}` : x == 0 ? '--' : `⬇${Math.abs(x)}`
  }
})}
</div>


<div class="grid grid-cols-1" style="grid-auto-rows: 560px;">
  <div class="card">
    ${BestArtistsPlot(bestArtists, playlistChoosen)}
  </div>
</div>

```js
const mostPopularArtists = view(Inputs.select(mostFrequent(bestArtists.filter(i => i.playlist == playlistChoosen).map(i => i.artists)).slice(0,10), {value: artistsNames[0], label: "Popular artists"}));
```

<div class="grid grid-cols-1" style="grid-auto-rows: 560px;">
  <div class="card">
    ${BestSongsPlot(bestArtists, playlistChoosen, mostPopularArtists)}
  </div>
</div>


<div class="card" style="margin: 1rem 0 2rem 0; padding: 0;">
  ${Inputs.table(bestArtists
  .filter((row, index) => bestArtists.map(i =>  `${i.song_id}${i.artists}`).indexOf(`${row.song_id}${row.artists}`) === index)
  .filter((row, index) => (row.playlist == playlistChoosen) & (mostPopularArtists.includes(row.artists)))
  , {
  columns: ["artists", "name", "album_name", "date"],
  })}
</div>
