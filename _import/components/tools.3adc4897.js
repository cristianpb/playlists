import * as Plot from "../../_npm/@observablehq/plot@0.6.16/e828d8c8.js";
import {resize} from "../../_observablehq/stdlib.95bfbf7e.js";

export const mostFrequent = arr => {
  const counts = arr.reduce((counts, num) => {
    counts[num] = (counts[num] || 0) + 1;
    return counts;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(i => i[0])
}

export const parseDate = date_in => {
  try {
    const res = `${date_in.getDate()}-${date_in.getMonth() + 1}-${date_in.getFullYear()}`
    return res
  } catch (e) {
    /* handle error */
    console.log(date_in, e);
    return "Error"
  }
}

const getDateXDaysAgo = (numOfDays, date = new Date()) => {
  const daysAgo = new Date(date.getTime());
  daysAgo.setDate(date.getDate() - numOfDays);
  daysAgo.setHours(0, 0, 0, 0);
  return daysAgo;
}


export function RecentSongsPlot(data_shallow) {
  const counts = data_shallow.filter((value, index) => data_shallow.map(i => `${i.song_id}${i.commit_date}`).indexOf(`${value.song_id}${value.commit_date}`) === index).reduce((counts, item) => {
    if (item.song_id in counts) {
      counts[item.song_id].count = counts[item.song_id].count + 1;
      counts[item.song_id].position = (counts[item.song_id].position + item.position)/2;
    } else {
      counts[item.song_id] = {
        count: 1,
        label: `${item.playlist} \n${item.artists} \n${item.name}`,
        size: (Math.log(item.name.length)).toFixed(),
        ...item
      }
    }
    return counts;
  }, {});
  const date = new Date();
  const monthAgo = getDateXDaysAgo(31, date);
  return resize((width, height) => {
    if (width < 500) {
    return Plot.plot({
      grid: false,
      width,
      height: (height - 95),
      title : `New songs from last month`,
      color: {
        legend: true,
      },
      y: {label: "Date"},
      marks: [
        Plot.image(
          Object.values(counts).filter(row => (row.date > monthAgo) & (row.position < 30) ),
          Plot.dodgeY({
            x: (d, idx) => idx % 5,
            //r: (d) => 20 + Math.exp(d.count + 40), // clip to a circle
            r: 20, // * width / 1100,
            preserveAspectRatio: "xMidYMin slice", // try not to clip heads
            src: "cover_url",
            title: "label",
          })
        ),
        Plot.text(
          Object.values(counts).filter(row => (row.date > monthAgo) & (row.position < 30) ),
          Plot.dodgeY({
            x: (d, idx) => idx % 5,
            r: 20, // * width / 1100, //  (d) => Math.min(22, Math.cbrt(d.size / 1e3) * 6), // 20, // clip to a circle
            preserveAspectRatio: "xMidYMin slice", // try not to clip heads
            text: (d) => d.name.replaceAll(" ", "\n").split("-")[0].split("(")[0],
            dx: 35,
            //fontSize: (d) => Math.min(11, Math.cbrt(1e9 / d.size ) / 6)
            //title: "label",
          })
        ),
      ]
    })
    } else {
    return Plot.plot({
      grid: true,
      width,
      height: (height - 95),
      title : `New songs`,
      color: {
        legend: true,
      },
      y: {label: "Date"},
      marks: [
        Plot.image(
          Object.values(counts).filter(row => (row.date > monthAgo) & (row.position < 30) ),
          Plot.dodgeX({
            y: "date",
            //r: (d) => 20 + Math.exp(d.count + 40), // clip to a circle
            r: 20, // * width / 1100,
            preserveAspectRatio: "xMidYMin slice", // try not to clip heads
            src: "cover_url",
            title: "label",
          })
        ),
        Plot.text(
          Object.values(counts).filter(row => (row.date > monthAgo) & (row.position < 30) ),
          Plot.dodgeX({
            y: "date",
            r: 20, // * width / 1100, //  (d) => Math.min(22, Math.cbrt(d.size / 1e3) * 6), // 20, // clip to a circle
            preserveAspectRatio: "xMidYMin slice", // try not to clip heads
            text: (d) => d.name.replaceAll(" ", "\n").split("-")[0].split("(")[0],
            dy: 35,
            //fontSize: (d) => Math.min(11, Math.cbrt(1e9 / d.size ) / 6)
            //title: "label",
          })
        ),

      ]
    })
    }
  }
  );
}


export function BestSongsPlot(data, playlistChoosen, mostPopularArtists) {
  const data_filtered = data.filter(row => (row.playlist == playlistChoosen) & (mostPopularArtists.includes(row.artists)))
  return resize((width, height) =>
    Plot.plot({
            grid: true,
            width,
            height: height - 95,
            title : `Best songs of ${mostPopularArtists} in ${playlistChoosen}`,
            color: {
              legend: false,
            },
            x: {label: "Date"},
            y: {label: "Position"},
            marks: [
              Plot.line(data_filtered, {
                x: "commit_date",
                y: "position",
                stroke: "name",
                text: "name",
                tip: {channels: {"artists": "artists", "playlist": "playlist"}}
              }),
              Plot.text(data_filtered, {
                filter: (d, idx) => (idx) % 5 === 0 ,
                x: "commit_date",
                y: "position",
                text: "name",
                dy: -6,
                lineAnchor: "bottom"
              })
            ],
          })
  );
}

export function BestArtistsPlot(data, playlistChoosen) {
  const data_filtered = data
    .filter((value, index) => data.map(i => `${i.artists}${i.commit_date_str}`).indexOf(`${value.artists}${value.commit_date_str}`) === index)
    .filter(row => (row.playlist == playlistChoosen) & (data.filter(i => i.playlist == playlistChoosen).map(i => i.artists).slice(0,10).includes(row.artists)))
  return resize((width, height) =>
    Plot.plot({
      grid: true,
      width,
      height: height - 95,
      title : `Best artist evolution in ${playlistChoosen}`,
      color: {
        legend: false,
      },
      x: {label: "Date"},
      y: {label: "Position"},
      marks: [
        Plot.line(data_filtered
          , {
            x: "commit_date",
            y: "position",
            stroke: "artists",
            tip: {channels: {"artists": "artists", "playlist": "playlist"}}
          }),
        Plot.text(data_filtered
      , {
          filter: (d, idx) => (idx) % 5 === 0 ,
          x: "commit_date",
          y: "position",
          text: "artists",
          dy: -6,
          lineAnchor: "bottom"
        })
      ],
    })
  );
}

export function RecentSongAdds(data, playlistChoosen, commit_date_old, commit_date_recent) {
  const recentData = data.filter(i => (i.playlist == playlistChoosen) & (i.commit_date == commit_date_recent))
  const pastData = data.filter(i => (i.playlist == playlistChoosen) & (i.commit_date == commit_date_old))

  let tableRows = []
  recentData.forEach((item, idx) => {
    pastData.forEach((oldItem, oldIdx) => {
      if (item.song_id === oldItem.song_id) {
        // still in the playlist but in different position
        // 0 for the same position
        // + for better position
        // - for worse position
        recentData[idx].attribute = oldItem.position - item.position;
        pastData[oldIdx].attribute = item.position - oldItem.position;
      }
    });
  });

  recentData.forEach((item) => {
    // new song
    if (!('attribute' in item)) {
      tableRows = [...tableRows, { ...item, attribute: '+' }];
    } else {
      tableRows = [...tableRows, item];
    }
  });

  pastData.forEach((item) => {
    // removed song
    if (!('attribute' in item)) {
      tableRows = [...tableRows, { ...item, attribute: '-' }];
    }
  });
          
  return tableRows.filter(i => i.attribute == "+")
  //.filter((value, index) => tableRows.map(i => `${i.song_id}${i.commit_date}`).indexOf(`${value.song_id}${value.commit_date}`) === index)
}
