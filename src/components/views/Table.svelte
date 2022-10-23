<script>
	import { data, oldData } from '../tools/stores';

	let tableRows = [];
	let playlists = new Set();
	let selected;

	const unsubscribe = data.subscribe((myData) => {
		myData.forEach((item, idx) => {
			$oldData.forEach((oldItem, oldIdx) => {
				if (item.playlist == oldItem.playlist) {
					if (item.song_id === oldItem.song_id) {
						// still in the playlist but in different position
						// 0 for the same position
						// + for worse position
						// - for better position
						myData[idx].attribute = item.position - oldItem.position;
						$oldData[oldIdx].attribute = item.position - oldItem.position;
					}
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
			playlists.add(item.playlist);
		});

		$oldData.forEach((item) => {
			// removed song
			if (!('attribute' in item)) {
				tableRows = [...tableRows, { ...item, attribute: '-' }];
			}
		});
	});
</script>

{#if playlists && playlists.size > 0}
	<select bind:value={selected}>
		{#each [...playlists] as playlist}
			<option value={playlist}>
				{playlist}
			</option>
		{/each}
	</select>
{/if}

{#if tableRows}
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
									New! {row.position}
								{:else if row.attribute == '-'}
									Out! {row.attribute}
								{:else if row.attribute !== 0}
									{row.attribute}
								{/if}
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{/if}
