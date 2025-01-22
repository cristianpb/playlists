<script>
  import * as Plot from '@observablehq/plot';
  let { latestSongs } = $props();

  let div = $state();
  let w = $state();

  $effect(() => {
      div?.firstChild?.remove();
      div?.append(doRecentPlot());
  });

  const doRecentPlot = () => {
    const counts = latestSongs
      .filter((value, index) => latestSongs.map(i => `${i.song_id}${i.commit_date}`).indexOf(`${value.song_id}${value.commit_date}`) === index)
      .reduce((acc, item) => {
      if (item.song_id in acc) {
        acc[item.song_id].count = acc[item.song_id].count + 1;
        acc[item.song_id].position = (acc[item.song_id].position + item.position)/2;
      } else {
        acc[item.song_id] = {
          count: 1,
          label: `${item.playlist} \n${item.artists} \n${item.name}`,
          size: (Math.log(item.name.length)).toFixed(),
          ...item
        }
      }
      return acc;
    }, {});
    console.log("count length", Object.keys(counts).length)
    return Plot.plot({
      grid: false,
      width: w,
      height: w < 500 ? 1.5 * w : w/2,
      color: {
        legend: true,
      },
      y: {label: "Date"},
      marks: [
        Plot.image(
          Object.values(counts), //.filter(row => (row.date > monthAgo) & (row.position < 30) ),
          Plot.dodgeX({
            y: "date",
          //Plot.dodgeY({
          //  x: (d, idx) => idx % 5,
            //r: (d) => 20 + Math.exp(d.count + 40), // clip to a circle
            r: 20, // * width / 1100,
            preserveAspectRatio: "xMidYMin slice", // try not to clip heads
            src: "cover_url",
            title: "label",
          })
        ),
        Plot.text(
          Object.values(counts), // .filter(row => (row.date > monthAgo) & (row.position < 30) ),
          Plot.dodgeX({
            y: "date",
          // Plot.dodgeY({
          //   x: (d, idx) => idx % 5,
            r: 20, // * width / 1100, //  (d) => Math.min(22, Math.cbrt(d.size / 1e3) * 6), // 20, // clip to a circle
            preserveAspectRatio: "xMidYMin slice", // try not to clip heads
            text: (d) => String(d.name).replaceAll(" ", "\n").split("-")[0].split("(")[0],
            // dx: 35,
            dy: 35,
            //fontSize: (d) => Math.min(11, Math.cbrt(1e9 / d.size ) / 6)
            //title: "label",
          })
        ),
      ]
    })
  }

  
</script>

<h2>New songs from last month</h2>
<div bind:this={div} role="img" bind:clientWidth={w}></div>
