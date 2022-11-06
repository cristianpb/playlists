<script>
	import { data } from '../tools/stores';

  let tableRows = {}
  let songList = [];
	let selected;

  const getDateXDaysAgo = (numOfDays, date = new Date()) => {
    const daysAgo = new Date(date.getTime());

    daysAgo.setDate(date.getDate() - numOfDays);

    daysAgo.setHours(0, 0, 0, 0);

    return daysAgo;
  }


  const unsubscribe = data.subscribe((myData) => {
    if (myData && myData.data.length > 0) {
      tableRows = {}
      const date = new Date();
      const monthAgo = getDateXDaysAgo(31, date);
      myData.data.forEach((item, idx) => {
        if ((item.date > monthAgo)) {
          if (!(item.song_id in tableRows)) {
            tableRows[item.song_id] = {...item, playlists: [item.playlist]};
          } else if ('playlists' in tableRows[item.song_id]) {
            tableRows[item.song_id].playlists = [...tableRows[item.song_id].playlists, item.playlist];
          }
        }
      });
    }
  });
</script>

{#if tableRows && Object.keys(tableRows).length > 0}
  <div class="table-container">
    <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Name</th>
          <th>Artists</th>
          <th>Playlists</th>
          <th>Date</th>
          <th>Position</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.values(tableRows) as row}
          <tr>
            <td>{row.name}</td>
            <td>{row.artists.join(', ')}</td>
            <td>{row.playlists.join(", \n")}</td>
            <td>{row.date.toLocaleDateString('en-US')}</td>
            <td>{row.position} </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
