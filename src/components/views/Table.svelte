<script>
	import { data, oldData } from '../tools/stores';

	let tableRows = [];
	let playlists = [];
	let selected;

  const unsubscribe = data.subscribe((myData) => {
    const oldUnsubscribe = oldData.subscribe(myOldData => {
      if (myData.length > 0 && myOldData.length > 0) {
        tableRows = []
        myData.forEach((item, idx) => {
          myOldData.forEach((oldItem, oldIdx) => {
            if ((item.playlist == oldItem.playlist) && (item.song_id === oldItem.song_id)) {
              // still in the playlist but in different position
              // 0 for the same position
              // + for better position
              // - for worse position
              myData[idx].attribute = oldItem.position - item.position;
              myOldData[oldIdx].attribute = item.position - oldItem.position;
            }
          });
        });

        myData.forEach((item) => {
          // new song
          if (!('attribute' in item)) {
            tableRows = [...tableRows, { ...item, attribute: '+' }];
          } else {
            tableRows = [...tableRows, item];
          }
        });

        myOldData.forEach((item) => {
          // removed song
          if (!('attribute' in item)) {
            tableRows = [...tableRows, { ...item, attribute: '-' }];
          }
        });
        playlists = [...new Set(myData.map(item => item.playlist))]
      }
    })
  });
</script>

{#if tableRows && tableRows.length > 0 && playlists.length > 0}
  <select bind:value={selected}>
    {#each playlists as playlist}
      <option value={playlist}>
      {playlist}
      </option>
    {/each}
  </select>
  {#if tableRows.length > 0}
    <div class="table-container">
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Artists</th>
            <th>Album</th>
            <th>Date</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {#each tableRows as row}
            {#if row.playlist === selected}
              <tr>
                <td>{row.name}</td>
                <td>{row.artists.join(', ')}</td>
                <td>{row.album_name}</td>
                <td>{row.date.toLocaleDateString('en-US')}</td>
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
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
{/if}
