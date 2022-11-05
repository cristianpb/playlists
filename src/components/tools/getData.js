const processCsv = (text) => {
	const rows = text.split('\n').map((str) => str.split(';'));
	const headers = rows.shift();
	return rows
		.filter((row) => row.length === headers.length)
		.map((row) => {
			let readRow = {};
			headers.forEach((key, idx) => (readRow[key] = row[idx]));
			return {
				name: readRow.name,
				artists: JSON.parse(readRow.artists.replaceAll(`'`, `"`)),
				album_name: readRow.album_name,
				date: new Date(readRow.date),
				song_id: readRow.song_id,
				cover_url: readRow.cover_url,
				playlist: readRow.playlist,
				position: +readRow.position
			};
		});
};

export const loadCsv = async (dataUrl) => {
	const res = await fetch(dataUrl);
	const text = await res.text();
	return processCsv(text);
};

export async function fetchHistory(idx) {
  const res = await fetch('https://api.github.com/repos/cristianpb/playlists/commits?sha=data')
  const commits = await res.json()
  const commitDate = new Date(commits[idx].commit.author.date)
  const data = await loadCsv(`https://raw.githubusercontent.com/cristianpb/playlists/${commits[idx].sha}/data.csv`)
  return {commitDate, data}
}
