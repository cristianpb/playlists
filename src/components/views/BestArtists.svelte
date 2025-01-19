<script>
  import * as Plot from '@observablehq/plot';
  let { dataFiltered, playlistChoosen } = $props();

  let div = $state();

  $effect(() => {
      div?.firstChild?.remove();
      div?.append(doBestArtistPlot());
  });

  const doBestArtistPlot = () => {
    return Plot.plot({
      grid: true,
      width: 800,
      height: 500,
      title : `Best artist evolution in ${playlistChoosen}`,
      color: {
        legend: false,
      },
      x: {label: "Date"},
      y: {label: "Position"},
      marks: [
        Plot.line(dataFiltered
          , {
            x: "commit_date",
            y: "position",
            stroke: "artists",
            tip: {channels: {"artists": "artists", "playlist": "playlist"}}
          }),
        Plot.text(dataFiltered
          , {
            filter: (d, idx) => (idx) % 4 === 0 ,
            x: "commit_date",
            y: "position",
            text: "artists",
            dy: -6,
            lineAnchor: "bottom"
          })
      ],
    })
  };

</script>

<div bind:this={div} role="img"></div>
