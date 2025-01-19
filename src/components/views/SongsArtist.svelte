<script>
  import * as Plot from '@observablehq/plot';
  let { songsNames, artistChoosen } = $props();

  let div = $state();

  $effect(() => {
    console.log("songsNames", songsNames);
      div?.firstChild?.remove();
      div?.append(doSongsPlot());
  });

  const doSongsPlot = () => {
    return Plot.plot({
            grid: true,
            width: 800,
            height: 500,
            title : `Best songs of ${artistChoosen}`,
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
                tip: {channels: {"artists": "artists", "playlist": "playlist"}}
              }),
              Plot.text(songsNames, {
                filter: (d, idx) => (idx) % 5 === 0 ,
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

<div bind:this={div} role="img"></div>
