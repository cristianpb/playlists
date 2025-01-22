<script>
  import * as Plot from '@observablehq/plot';
  let { dataFiltered, playlistChoosen, mostFrequentArtists } = $props();

  let div = $state();
  let w = $state();

  $effect(() => {
      div?.firstChild?.remove();
      div?.append(doBestArtistPlot());
  });

  const doBestArtistPlot = () => {
    return Plot.plot({
      grid: true,
      width: w,
      height: w < 500 ? 1.5 * w : w/2,
      color: {
        legend: false,
      },
      x: {label: "Date"},
      y: {label: "Position"},
      marks: [
        Plot.line(dataFiltered
          .map(song => {
            song.artists = (typeof song.artists === 'string') ? song.artists : song.artists.filter(artist =>  mostFrequentArtists.indexOf(artist) > -1)[0]
            song.commit_date = new Date(song.commit_date)
            return song
          })
          .filter((value, index) => dataFiltered.map(i => `${i.artists}${i.commit_date}`).indexOf(`${value.artists}${value.commit_date}`) === index)
          , {
            x: "commit_date",
            y: "position",
            stroke: "artists",
            tip: {channels: {"artists": "artists"}}
          }),
        Plot.text(dataFiltered
          .map(song => {
            song.artists = (typeof song.artists === 'string') ? song.artists : song.artists.filter(artist =>  mostFrequentArtists.indexOf(artist) > -1)[0]
            song.commit_date = new Date(song.commit_date)
            return song
          })
          .filter((value, index) => dataFiltered.map(i => `${i.artists}${i.commit_date}`).indexOf(`${value.artists}${value.commit_date}`) === index)
      , {
            filter: (d, idx) => (idx) % 4 === 0 ,
            x: "commit_date",
            y: "position",
            text: "artists",
            dy: -6,
            lineAnchor: "bottom",
          })
      ],
    })
  };

</script>

<h2>Best artist evolution in {playlistChoosen}</h2>
<div bind:this={div} role="img" bind:clientWidth={w}></div>
