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
    <table class="table">
      <thead>
        <tr>
          <th class="col-position">Position</th>
          <th>Artists</th>
          <th>Name</th>
          <th class="col-album">Album</th>
          <th class="col-attribute">Attribute</th>
        </tr>
      </thead>
      <tbody>
        {#each tableRows as row}
          <tr>
            <td class="col-position">{row.position}</td>
            <td>{row.artists}</td>
            <td>{row.name}</td>
            <td class="col-album">{row.album_name}</td>
            <td class="col-attribute">
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

<style>
  .table-container {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    -webkit-overflow-scrolling: touch;
  }

  .table {
    width: 100%;
    min-width: 30rem;
    border-collapse: collapse;
    font-size: 0.9rem;
    background: #fff;
  }

  thead th {
    position: sticky;
    top: 0;
    background: var(--color-bg-1);
    color: var(--color-text);
    text-align: left;
    padding: 0.6rem 0.75rem;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tbody td {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--color-bg-0);
    vertical-align: top;
  }

  tbody tr:nth-child(even) {
    background: rgba(0, 0, 0, 0.03);
  }

  tbody tr:hover {
    background: rgba(64, 179, 255, 0.12);
  }

  .col-position,
  .col-attribute {
    white-space: nowrap;
    text-align: center;
  }

  .col-album {
    color: var(--color-text);
    opacity: 0.75;
  }

  @media (max-width: 640px) {
    .table {
      min-width: 22rem;
      font-size: 0.8rem;
    }

    thead th,
    tbody td {
      padding: 0.4rem 0.5rem;
    }

    .col-album {
      display: none;
    }
  }
</style>
