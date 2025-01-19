<script>
  export let diffData
  export let playlistChoosen
  export let last_commits
  
  $: tableRows = RecentSongAdds(diffData, playlistChoosen, last_commits[0], last_commits[1])

  const RecentSongAdds = (data, playlistChoosen, commit_date_old, commit_date_recent) => {
    console.log("table recentSongAdds", data, playlistChoosen, commit_date_old, commit_date_recent);
    const recentData = data.filter(i => (i.playlist == playlistChoosen) & (i.commit_date == commit_date_recent))
    const pastData = data.filter(i => (i.playlist == playlistChoosen) & (i.commit_date == commit_date_old))

    let rows = []
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
        rows = [...rows, { ...item, attribute: '+' }];
      } else {
        rows = [...rows, item];
      }
    });

    pastData.forEach((item) => {
      // removed song
      if (!('attribute' in item)) {
        rows = [...rows, { ...item, attribute: '-' }];
      }
    });

    return rows.filter(i => i.attribute == "+")
    //.filter((value, index) => tableRows.map(i => `${i.song_id}${i.commit_date}`).indexOf(`${value.song_id}${value.commit_date}`) === index)
  }

</script>


{#if tableRows.length > 0}
  <div class="table-container">
    <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Position</th>
          <th>Artists</th>
          <th>Name</th>
          <th>Album</th>
          <th>Attribute</th>
        </tr>
      </thead>
      <tbody>
        {#each tableRows as row}
          <tr>
            <td>{row.position}</td>
            <td>{row.artists}</td>
            <td>{row.name}</td>
            <td>{row.album_name}</td>
            <td>
              {#if row.attribute == '+'}
                🆕 {row.position}
              {:else if row.attribute == '-'}
                🗑 {row.position}
              {:else}
                {#if row.attribute >  0}
                  ⬆ {row.attribute}
                {:else if row.attribute == 0}
                  {row.position}
                {:else}
                  ⬇ {Math.abs(row.attribute)}
                {/if}
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
