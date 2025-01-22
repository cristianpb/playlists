<script>
  import * as Plot from '@observablehq/plot';
  let { songsNames, artistChoosen, playlistChoosen } = $props();

  let div = $state();
  let w = $state();

  $effect(() => {
    div?.firstChild?.remove();
    div?.append(doSongsPlot());
  });

  const doSongsPlot = () => {
    return Plot.plot({
            grid: true,
            width: w,
            height: w/2,
            color: {
              legend: false,
            },
            x: {label: "Date"},
            y: {label: "Position"},
            marks: [
              Plot.line(songsNames, {
                x: "commit_date",
                y: "position",
                stroke: "name",
                text: "name",
                tip: {channels: {"artists": "artists", "album_name": "album_name"}}
              }),
              Plot.text(songsNames, {
                filter: (d, idx) => idx % 4 === 0 ,
                x: "commit_date",
                y: "position",
                text: "name",
                dy: -6,
                lineAnchor: "bottom"
              })
            ],
          })
  };

</script>

<h2>Best {[...new Set(songsNames.map(song => song.song_id))].length} songs of {artistChoosen} in {playlistChoosen}</h2>
<div bind:this={div} role="img" bind:clientWidth={w} ></div>
